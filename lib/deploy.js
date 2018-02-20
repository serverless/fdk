'use strict'

const listFunctions = require('./listFunctions')
const listSubscriptions = require('./listSubscriptions')
const deleteFunction = require('./deleteFunction')
const unsubscribe = require('./unsubscribe')
const configure = require('./configure')
const without = require('ramda/src/without')

/*
 * Configures the Event Gateway as given in params.
 */
module.exports = (config, params) => {
  const updatedParams = { functions: [], subscriptions: [] }

  return listSubscriptions(config)
  .then(existing => {
    const removed = without(params.subscriptions, existing.subscriptions)
    const added = without(existing.subscriptions, params.subscriptions)

    updatedParams.subscriptions = added

    return Promise.all(removed.map(subscription =>
      unsubscribe(config, { subscriptionId: subscription.subscriptionId })
    ))
    .catch(subscriptionError => {
      throw new Error(`Failed to delete subscriptions. ${subscriptionError.message}`)
    })
  })
  .then(() => listFunctions(config))
  .then(existing => {
    const removed = without(params.functions, existing.functions)
    const added = without(existing.functions, params.functions)

    updatedParams.functions = added

    return Promise.all(removed.map(
        func => deleteFunction(config, { functionId: func.functionId })
    ))
    .catch(funcError => {
      throw new Error(`Failed to delete functions. ${funcError.message}`)
    })
  })
  .then(() => configure(config, updatedParams))
}
