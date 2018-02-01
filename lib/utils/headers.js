'use strict'

const keys = require('ramda/src/keys')
const contains = require('ramda/src/contains')
const assoc = require('ramda/src/assoc')

module.exports = {
  injectToken: headers => {
    let updatedHeaders = Object.assign({}, headers)
    const isTokenIncluded = contains('EVENT_GATEWAY_TOKEN', keys(process.env))
    if (isTokenIncluded) {
      updatedHeaders = assoc(
        'Authorization',
        `bearer ${process.env.EVENT_GATEWAY_TOKEN}`,
        headers
      )
    }
    return updatedHeaders
  },
}
