'use strict'

const urlUtils = require('./urlUtils')

module.exports = config =>
  config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, '/v1/functions'))
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .json()
          .then(error => {
            errorMessage = error.error
            throw new Error(`Internal rethrow of ${error}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(`Failed to fetch the function list due the error: ${errorMessage}`)
            } else {
              throw new Error("Failed to fetch the function list and couldn't parse error body.")
            }
          })
      }
      return response.json()
    })
