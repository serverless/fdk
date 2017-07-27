module.exports = (config, params) =>
  config
    .fetch(`${config.configurationOrigin}/v1/functions/${params.functionId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.status !== 200) {
        // TODO improve throwed errors
        throw new Error('Failed to remove the function.')
      }
      return response.json()
    })
