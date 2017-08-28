'use strict'

const urlUtils = require('./urlUtils')

module.exports = (config, params) =>
  config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, '/v1/subscriptions'), {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        const tmpMsg = `Failed to subscribe the event ${params.event}`
        const errorStart = `${tmpMsg} to the function ${params.functionId}`
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
      return response.json()
    })
