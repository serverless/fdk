module.exports = config =>
  config.fetch(`${config.configurationUrl}/v1/subscriptions`).then(response => {
    if (response.status !== 200) {
      // TODO improve throwed errors
      throw new Error('Failed to fetch the functions.')
    }
    return response.json()
  })
