const fetch = require('isomorphic-fetch')
const initLib = require('./lib/index')

module.exports = initLib(fetch)
