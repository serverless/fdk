'use strict'

const keys = require('ramda/src/keys')
const contains = require('ramda/src/contains')
const assoc = require('ramda/src/assoc')

module.exports = {
  injectServerlessApplicationToken: headers => {
    let updatedHeaders = Object.assign({}, headers)
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
