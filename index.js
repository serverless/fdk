const AWS = require('aws-sdk')
const FDK = require('./fdk')
const Handler = require('./handler')

const fdk = new FDK(
  new AWS.Lambda({
    apiVersion: '2015-03-31',
  })
)

exports.invoke = fdk.invoke.bind(fdk)
exports.trigger = fdk.trigger.bind(fdk)
exports.handler = handler => new Handler().handler(handler)
