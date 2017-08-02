const url = require('url')

module.exports = {
  generateApiUrl: apiUrl => apiUrl,
  generateConfigureUrl: apiUrl => {
    const parsedUrl = url.parse(apiUrl)
    const authSection = parsedUrl.auth ? `${parsedUrl.auth}@` : ''
    return `${parsedUrl.protocol}//${authSection}${parsedUrl.hostname}:4001/`
  },
}
