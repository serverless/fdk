const urlUtils = require('./urlUtils')

module.exports = (config, params) =>
  config
    .fetch(
      urlUtils.joinUrlWithPath(
        config.configurationUrl,
        `/v1/subscriptions/${params.subscriptionId}`
      ),
    {
      method: 'DELETE',
    }
    )
    .then(response => {
      if (response.status !== 204) {
        // TODO improve throwed errors
        throw new Error('Failed to remove the subscription.')
      }
    })
