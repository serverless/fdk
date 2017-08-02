const R = require('ramda')
const registerFunction = require('./lib/registerFunction')
const deleteFunction = require('./lib/deleteFunction')
const listFunctions = require('./lib/listFunctions')
const subscribe = require('./lib/subscribe')
const unsubscribe = require('./lib/unsubscribe')
const listSubscriptions = require('./lib/listSubscriptions')
const configure = require('./lib/configure')
const resetConfiguration = require('./lib/resetConfiguration')
const emit = require('./lib/emit')
const invoke = require('./lib/invoke')
const urlUtils = require('./lib/urlUtils')

const eventGateway = configuration => {
  if (
    R.isNil(configuration) ||
    typeof configuration !== 'object' ||
    R.isNil(configuration.url) ||
    typeof configuration.url !== 'string'
  ) {
    throw new Error("Please provide an object with the property 'url' to eventGateway")
  }

  const config = {
    apiUrl: configuration.url,
    configurationUrl:
      configuration.configurationUrl || urlUtils.generateConfigureUrl(configuration.url),
    // eslint-disable-next-line global-require
    fetch: configuration.fetch || require('isomorphic-fetch'),
  }

  return {
    emit: params => emit(config, params),
    invoke: params => invoke(config, params),
    configure: params => configure(config, params),
    resetConfiguration: params => resetConfiguration(config, params),
    registerFunction: params => registerFunction(config, params),
    deleteFunction: params => deleteFunction(config, params),
    listFunctions: params => listFunctions(config, params),
    subscribe: params => subscribe(config, params),
    unsubscribe: params => unsubscribe(config, params),
    listSubscriptions: params => listSubscriptions(config, params),
  }
}

module.exports = {
  eventGateway,
  // TODO implement and export handler
}
