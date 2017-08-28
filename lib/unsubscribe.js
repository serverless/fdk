'use strict'

const urlUtils = require('./urlUtils')

module.exports = (config, params) =>
  config
    .fetch(
      urlUtils.joinUrlWithPath(
        config.configurationUrl,
        `/v1/subscriptions/${params.subscriptionId}`
      ),
    {
      method: 'DELETE',
    }
    )
    .then(response => {
      if (response.status !== 204) {
        let errorMessage = null
        const errorStart = `Failed to unsubscribe the subscription ${params.subscriptionId}`
        return response
          .json()
          .then(error => {
            errorMessage = error.error
            throw new Error(`Internal rethrow of ${error}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`${errorStart} due the error: ${errorMessage}`)
            } else {
              throw new Error(`${errorStart} and couldn't parse error body.`)
            }
          })
      }
      return undefined
    })
