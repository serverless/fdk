const registerFunction = require('./registerFunction')
const subscribe = require('./subscribe')

/*
 * Registers all functions first and only if succeded initiates all provided subscriptions.
 */
module.exports = (config, params) => {
  const functionsPromises = params.functions.map(func => registerFunction(config, func))
  return Promise.all(functionsPromises)
    .then(functions => {
      const subscriptionsPromises = params.subscriptions.map(subscription =>
        subscribe(config, subscription)
      )
      return Promise.all(subscriptionsPromises)
        .then(subscriptions => ({
          functions,
          subscriptions,
        }))
        .catch(subscriptionError => {
          throw new Error('Failed to initate at least one subscription.\n', subscriptionError)
        })
    })
    .catch(functionError => {
      throw new Error('Failed to register at least one function.\n', functionError)
    })
}
