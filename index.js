const AWS = require('aws-sdk')
const Stdlib = require('./stdlib')
const Handler = require('./handler')

const stdlib = new Stdlib(new AWS.Lambda({
  apiVersion: '2015-03-31',
}))

exports = module.exports = handler => new Handler(handler) // eslint-disable-line
exports.call = stdlib.call
