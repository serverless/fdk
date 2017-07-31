module.exports = (config, params) =>
  config
    .fetch(`${config.configurationUrl}/v1/subscriptions/${params.subscriptionId}`, {
      method: 'DELETE',
    })
    .then(response => {
      if (response.status !== 200) {
        // TODO improve throwed errors
        throw new Error('Failed to remove the subscription.')
      }
    })
