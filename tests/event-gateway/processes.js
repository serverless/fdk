const path = require('path')
const spawn = require('child_process').spawn
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const portfinder = require('portfinder')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const uuidv1 = require('uuid/v1')
// eslint-disable-next-line node/no-unpublished-require, import/no-extraneous-dependencies
const rimraf = require('rimraf')

// eslint-disable-next-line no-undef
jasmine.DEFAULT_TIMEOUT_INTERVAL = 4000

const eventGatewayPath = path.join(__dirname, 'darwin_amd64', 'event-gateway')
const processStore = {}

module.exports = {
  spawn: () =>
    new Promise((resolve, reject) => {
      portfinder
        .getPortPromise()
        .then(port => {
          const id = uuidv1()
          const args = ['--dev', `--embed-data-dir=${id}`, `--config-port=${port}`]
          processStore[id] = spawn(eventGatewayPath, args, {
            stdio: 'inherit',
          })
          setTimeout(
            () =>
              resolve({
                id,
                configPort: port,
              }),
            2000
          )
        })
        .catch(err => {
          reject(err)
        })
    }),
  shutDown: id => {
    processStore[id].kill()
    rimraf.sync(`./${id}`)
  },
}
