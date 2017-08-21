const fetch = require('whatwg-fetch')
const initLib = require('./lib/index')

module.exports = initLib(fetch)
