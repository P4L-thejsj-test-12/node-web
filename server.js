const app = require('connect')()
const path = require('path')
const serve_static = require('serve-static')

const root = 'dist/'
const port = 3000

root.split(',').forEach((r) => {
  app.use(serve_static(path.join(process.cwd(), r)))
})

app.listen(port, () => {
  var host = process.env.RUNNABLE_CONTAINER_URL || 'localhost'
  console.log('Application hosted at http://%s:%s', host, port)
})
