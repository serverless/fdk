const AWS = require('aws-sdk')
const Stdlib = require('./stdlib')
const Handler = require('./handler')

exports = module.exports = handler => new Handler() // eslint-disable-line

const stdlib = new Stdlib(new AWS.Lambda({
  apiVersion: '2015-03-31',
}))

exports.call = stdlib.call
