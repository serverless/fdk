'use strict'

const listFunctions = require('./listFunctions')
const listSubscriptions = require('./listSubscriptions')
const deleteFunction = require('./deleteFunction')
const unsubscribe = require('./unsubscribe')

/**
 * Steps:
 * 1. Retrieve all the subscriptions from the Event Gateway
 * 2. Remove all the existing subscriptions
 * 3. Retrieve all the functions from the Event Gateway
 * 4. Remove all the existing functions
 */
module.exports = config =>
  Promise.all([listFunctions(config), listSubscriptions(config)]).then(responses =>
    Promise.all(
      responses[1].subscriptions.map(subscription =>
        unsubscribe(config, { subscriptionId: subscription.subscriptionId })
      )
    )
      .then(() =>
        Promise.all(
          responses[0].functions.map(func =>
            deleteFunction(config, { functionId: func.functionId })
          )
        )
          .then(() => undefined)
          .catch(funcError => {
            throw new Error(`Failed to reset the Event Gateway configuration. ${funcError.message}`)
          })
      )
      .catch(subscriptionError => {
        throw new Error(
          `Failed to reset the Event Gateway configuration. ${subscriptionError.message}`
        )
      })
  )
