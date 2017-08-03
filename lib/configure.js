const registerFunction = require('./registerFunction')
const subscribe = require('./subscribe')
const R = require('ramda')

// const createSubscriptions = config =>
//   R.pipe(R.propOr([], 'subscriptions'), R.map(subscription => subscribe(config, subscription)))

/*
 * Registers all functions first and only if succeded initiates all provided subscriptions.
 */
module.exports = (config, params) => {
  const registerFunctions = R.pipe(
    R.propOr([], 'functions'),
    R.map(func => registerFunction(config, func))
  )

  const createSubscriptions = R.pipe(
    R.propOr([], 'subscriptions'),
    R.map(subscription => subscribe(config, subscription))
  )

  return Promise.all(registerFunctions(params))
    .then(functions =>
      Promise.all(createSubscriptions(params))
        .then(subscriptions => ({
          functions,
          subscriptions,
        }))
        .catch(subscriptionError => {
          throw new Error('Failed to initate at least one subscription.\n', subscriptionError)
        })
    )
    .catch(functionError => {
      throw new Error('Failed to register at least one function.\n', functionError)
    })
}
