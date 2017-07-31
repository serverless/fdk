module.exports = (config, params) =>
  config.fetch(`${config.apiUrl}/`, {
    method: 'POST',
    body: JSON.stringify({
      data: params.data,
    }),
    headers: {
      'Content-Type': 'application/json',
      Event: params.event,
    },
  })
