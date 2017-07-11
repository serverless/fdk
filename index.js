const AWS = require('aws-sdk')
const FDK = require('./fdk')
const Handler = require('./handler')

const fdk = new FDK(
  new AWS.Lambda({
    apiVersion: '2015-03-31',
  })
)

exports.invoke = fdk.invoke
exports.trigger = fdk.trigger
exports.handler = handler => new Handler().handler(handler)
