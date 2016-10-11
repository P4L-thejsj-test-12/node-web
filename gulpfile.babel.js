import gulp from 'gulp'
import autoprefixer from 'autoprefixer'
import browserify from 'browserify'
import watchify from 'watchify'
import source from 'vinyl-source-stream'
import buffer from 'vinyl-buffer'
import standard from 'gulp-standard'
import babelify from 'babelify'
import uglify from 'gulp-uglify'
import rimraf from 'rimraf'
import notify from 'gulp-notify'
import postcss from 'gulp-postcss'
import rename from 'gulp-rename'
import nested from 'postcss-nested'
import vars from 'postcss-simple-vars'
import extend from 'postcss-simple-extend'
import cssnano from 'cssnano'
import runSequence from 'run-sequence'
import { spawn } from 'child_process'
import es from 'event-stream'
import fs from 'fs'
import gitinfo from './gitinfo'
import server from './server'

const paths = {
  bundle: 'app.js',
  entry: 'src/App.js',
  srcCss: 'src/**/*.scss',
  srcImg: 'src/images/**',
  srcLint: 'src/**/*.js',
  dist: 'dist',
  distJs: 'dist/js',
  distImg: 'dist/images'
}

const customOpts = {
  entries: [paths.entry],
  debug: true,
  cache: {},
  packageCache: {}
}

const opts = Object.assign({}, watchify.args, customOpts)

gulp.task('clean', cb => {
  rimraf('dist', cb)
})

gulp.task('serve', () => {
  spawn('node', server, { stdio: 'inherit' })
})

gulp.task('watchify', () => {
  const bundler = watchify(browserify(opts))

  function rebundle () {
    return bundler.bundle()
      .on('error', notify.onError())
      .pipe(source(paths.bundle))
      .pipe(buffer())
      .pipe(gulp.dest(paths.distJs))
  }

  bundler.transform(babelify)
    .on('update', rebundle)
  return rebundle()
})

gulp.task('browserify', () => {
  browserify(paths.entry, { debug: true })
    .transform(babelify)
    .bundle()
    .pipe(source(paths.bundle))
    .pipe(buffer())
    .pipe(uglify())
    .pipe(gulp.dest(paths.distJs))
})

gulp.task('styles', () => {
  gulp.src(paths.srcCss)
    .pipe(rename({ extname: '.css' }))
    .pipe(postcss([vars, extend, nested, autoprefixer, cssnano]))
    .pipe(gulp.dest(paths.dist))
})

gulp.task('copy', () => {
  gulp.src('src/index.html')
    .pipe(gulp.dest(paths.dist))

  gulp.src(paths.srcImg)
    .pipe(gulp.dest(paths.distImg))
})

gulp.task('git', () => {
  return gitinfo()
    .pipe(es.map((data) => {
      fs.writeFile('src/git.json',
        JSON.stringify(data),
        (err) => {
          if (err) console.log(err)
        })
    }))
})

gulp.task('lint', () => {
  gulp.src(paths.srcLint)
    .pipe(standard())
})

gulp.task('watchTask', () => {
  gulp.watch(paths.srcCss, ['styles'])
  gulp.watch(paths.srcLint, ['lint'])
})

gulp.task('watch', cb => {
  runSequence('clean', ['git', 'serve', 'watchTask', 'watchify', 'styles', 'copy', 'lint'], cb)
})

gulp.task('build', cb => {
  process.env.NODE_ENV = 'production'
  runSequence('clean', ['git', 'browserify', 'styles', 'copy'], cb)
})
