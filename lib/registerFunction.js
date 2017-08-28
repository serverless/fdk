'use strict'

const urlUtils = require('./urlUtils')

module.exports = (config, params) =>
  config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, '/v1/functions'), {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        const funcId = params.functionId
        return response
          .json()
          .then(error => {
            errorMessage = error.error
            throw new Error(`Internal rethrow of ${error}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to register the function ${funcId} due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to register the function ${funcId} and couldn't parse error body.`
              )
            }
          })
      }
      return response.json()
    })
