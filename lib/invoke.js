module.exports = (config, params) =>
  config.fetch(`${config.apiOrigin}/`, {
    method: 'POST',
    body: JSON.stringify({
      data: params.data,
    }),
    headers: {
      'Content-Type': 'application/json',
      Event: 'invoke',
      'Function-ID': params.functionId,
    },
  })
