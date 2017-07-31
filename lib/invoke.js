module.exports = (config, params) =>
  config.fetch(`${config.apiOrigin}/_invoke`, {
    method: 'POST',
    body: JSON.stringify({
      data: {
        body: params.data,
      },
    }),
    headers: {
      'Content-Type': 'application/json',
      Event: 'invoke',
      FunctionID: params.functionId,
    },
  })
