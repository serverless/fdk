'use strict'

const registerFunction = require('./registerFunction')
const subscribe = require('./subscribe')
const pipe = require('ramda/src/pipe')
const propOr = require('ramda/src/propOr')
const map = require('ramda/src/map')

/*
 * Registers all functions first and only if succeded initiates all provided subscriptions.
 */
module.exports = (config, params) => {
  const registerFunctions = pipe(
    propOr([], 'functions'),
    map(func => registerFunction(config, func))
  )

  const createSubscriptions = pipe(
    propOr([], 'subscriptions'),
    map(subscription => subscribe(config, subscription))
  )

  return Promise.all(registerFunctions(params))
    .then(functions =>
      Promise.all(createSubscriptions(params))
        .then(subscriptions => ({
          functions,
          subscriptions,
        }))
        .catch(subscriptionError => {
          throw new Error(`Failed to configure the Event Gateway. ${subscriptionError.message}`)
        })
    )
    .catch(functionError => {
      throw new Error(`Failed to configure the Event Gateway. ${functionError.message}`)
    })
}
