module.exports = (config, params) =>
  config
    .fetch(`${config.configurationUrl}/v1/subscriptions`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: { 'Content-Type': 'application/json' },
    })
    .then(response => {
      if (response.status !== 200) {
        // TODO improve throwed errors
        throw new Error('Failed to add the subscription.')
      }
      return response.json()
    })
