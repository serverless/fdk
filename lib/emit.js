'use strict'

const headersUtils = require('./utils/headers')

module.exports = (config, params) => {
  const data = params.dataType ? params.data : JSON.stringify(params.data)
  let headers = {
    'Content-Type': params.dataType || 'application/json',
    Event: params.event,
  }
  headers = headersUtils.injectAuthorizationToken(headers)
  return config
    .fetch(`${config.apiUrl}`, {
      method: 'POST',
      body: data,
      headers,
    })
    .then(response => {
      if (response.status !== 202) {
        // TODO improve throwed errors
        throw new Error(`Failed to emit the event ${params.event}`)
      }
      return response
    })
}
