module.exports = (config, params) =>
  config.fetch(`${config.apiOrigin}/_invoke`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        body: JSON.stringify(params),
      },
    }),
    headers: { 'Content-Type': 'application/json' },
  })
