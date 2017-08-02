const urlUtils = require('./urlUtils')

module.exports = config =>
  config
    .fetch(urlUtils.joinUrlWithPath(config.configurationUrl, '/v1/functions'))
    .then(response => {
      if (response.status !== 200) {
        // TODO improve throwed errors
        throw new Error('Failed to fetch the functions.')
      }
      return response.json()
    })
