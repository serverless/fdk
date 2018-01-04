'use strict'

const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const data = params.dataType ? params.data : JSON.stringify(params.data)
  let headers = {
    'Content-Type': params.dataType || 'application/json',
    Event: 'invoke',
    'Function-ID': params.functionId,
  }
  headers = headersUtils.injectServerlessApplicationToken(headers)
  return config
    .fetch(`${config.apiUrl}`, {
      method: 'POST',
      body: data,
      headers,
    })
    .then(response => {
      if (response.status !== 200) {
        let errorMessage = null
        return response
          .text()
          .then(errMsg => {
            errorMessage = errMsg
            throw new Error(`Internal rethrow of ${errMsg}`)
          })
          .catch(() => {
            if (errorMessage) {
              throw new Error(
                `Failed to invoke function ${params.functionId} due the error: ${errorMessage}`
              )
            } else {
              throw new Error(
                `Failed to invoke function ${params.functionId} and couldn't parse error body.`
              )
            }
          })
      }
      return response
    })
}
