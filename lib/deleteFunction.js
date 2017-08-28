'use strict'

const urlUtils = require('./urlUtils')

module.exports = (config, params) =>
  config
    .fetch(
      urlUtils.joinUrlWithPath(config.configurationUrl, `/v1/functions/${params.functionId}`),
    {
      method: 'DELETE',
    }
    )
    .then(response => {
      if (response.status !== 204) {
        let errorMessage = null
        return response
          .json()
          .then(error => {
            errorMessage = error.error
            throw new Error(`Internal rethrow of ${error}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to delete the function ${params.functionId} due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to delete the function ${params.functionId} and couldn't parse error body.`
              )
            }
          })
      }
      return undefined
    })
