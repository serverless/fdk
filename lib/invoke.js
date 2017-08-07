module.exports = (config, params) => {
  const data = params.dataType ? params.data : JSON.stringify(params.data)
  return config.fetch(`${config.apiUrl}`, {
    method: 'POST',
    body: data,
    headers: {
      'Content-Type': params.dataType || 'application/json',
      Event: 'invoke',
      'Function-ID': params.functionId,
    },
  })
}
