const listFunctions = require('./listFunctions')
const listSubscriptions = require('./listSubscriptions')
const deleteFunction = require('./deleteFunction')
const deleteSubscription = require('./deleteSubscription')

module.exports = config =>
  Promise.all([listFunctions(config), listSubscriptions(config)]).then(responses =>
    Promise.all(
      responses[1].subscriptions.map(subscription =>
        deleteSubscription(config, { subscriptionId: subscription.subscriptionId })
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
            throw new Error('Failed to remove certain functions.\n', funcError)
          })
      )
      .catch(subscriptionError => {
        throw new Error(
          'Failed to remove certain subscriptions and functions.\n',
          subscriptionError
        )
      })
  )
