'use strict'

const keys = require('ramda/src/keys')
const contains = require('ramda/src/contains')
const assoc = require('ramda/src/assoc')

module.exports = {
  injectAuthorizationToken: headers => {
    let updatedHeaders = headers
    const isTokenIncluded = contains('SERVERLESS_APPLICATION_TOKEN', keys(process.env))
    if (isTokenIncluded) {
      updatedHeaders = assoc(
        'Authorization',
        `bearer ${process.env.SERVERLESS_APPLICATION_TOKEN}`,
        headers
      )
    }
    return updatedHeaders
  },
}
