const AWS = require('aws-sdk')
const FDK = require('./fdk')
const Handler = require('./handler')

exports = module.exports = handler => new Handler() // eslint-disable-line

const fdk = new FDK(new AWS.Lambda({
  apiVersion: '2015-03-31',
}))

exports.call = fdk.call
exports.trigger = fdk.trigger
