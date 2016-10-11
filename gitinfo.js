const exec = require('child_process').exec
const es = require('event-stream')
const os = require('os')

module.exports = function (cb) {
  var commands = {
    'name': ['rev-parse', '--abbrev-ref', 'HEAD'],
    'sHA': ['rev-parse', 'HEAD'],
    'shortSHA': ['rev-parse', '--short', 'HEAD'],
    'user': ['config', '--global', 'user.name'],
    'lastCommitTime': ['log', '--format="%ai"', '-n1', 'HEAD'],
    'lastCommitMessage': ['log', '--format="%B"', '-n1', 'HEAD'],
    'lastCommitAuthor': ['log', '--format="%aN"', '-n1', 'HEAD'],
    'tag': ['describe', '--abbrev=0', '--exact-match'],
    'remoteOriginUrl': ['config', '--get-all', 'remote.origin.url']
  }
  var streams = []
  Object.keys(commands).forEach(function (cmd) {
    var command = commands[cmd]
    var gitCMD = 'echo ' + cmd + ' && git ' + command.join(' ')
    var child = exec(gitCMD, function (err, stdout, stderr) {
      if (err && !err) console.log(err)
    })
    streams.push(child.stdout.pipe(es.wait()))
  })
  var stream = es.merge.apply(es, streams)
  return stream
    .pipe(es.map(function (data, cb) {
      var lines = data.toString().split(os.EOL)
      lines[0] = lines[0].replace(' ', '')
      lines[1] = lines[1].replace(os.EOL, '').replace('\n', '')
      cb(null, lines[0] + ':' + lines[1])
    }))
    .pipe(es.join(','))
    .pipe(es.wait())
    .pipe(es.map(function (data, cb) {
      var obj = {}
      var lines = data.split(',')
      lines.forEach(function (line) {
        var section = line.split(':')
        var key = section.shift()
        obj[key] = section.join(':')
      })
      cb(null, JSON.stringify(obj))
    }))
    .pipe(es.parse())
}
