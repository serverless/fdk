const R = require('ramda')
const UrlParse = require('url-parse')

module.exports = {
  generateConfigureUrl: apiUrl => {
    const parsedUrl = new UrlParse(apiUrl)
    const authSection = parsedUrl.auth ? `${parsedUrl.auth}@` : ''
    return `${parsedUrl.protocol}//${authSection}${parsedUrl.hostname}:4001/`
  },
  joinUrlWithPath: (baseUrl, path) => {
    const urlHasSlash = R.last(baseUrl) === '/'
    const pathHasSlash = path[0] === '/'
    if (urlHasSlash && pathHasSlash) {
      return `${baseUrl}${path.substring(1)}`
    } else if (!urlHasSlash && !pathHasSlash) {
      return `${baseUrl}/${path}`
    }
    return `${baseUrl}${path}`
  },
}
