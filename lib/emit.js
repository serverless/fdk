'use strict'

module.exports = (config, params) => {
  const data = params.dataType ? params.data : JSON.stringify(params.data)
  return config
    .fetch(`${config.apiUrl}`, {
      method: 'POST',
      body: data,
      headers: {
        'Content-Type': params.dataType || 'application/json',
        Event: params.event,
      },
    })
    .then(response => {
      if (response.status !== 202) {
        // TODO improve throwed errors
        throw new Error(`Failed to emit the event ${params.event}`)
      }
      return response
    })
}
