'use strict'

const isNil = require('ramda/src/isNil')
const registerFunction = require('./registerFunction')
const deleteFunction = require('./deleteFunction')
const listFunctions = require('./listFunctions')
const subscribe = require('./subscribe')
const unsubscribe = require('./unsubscribe')
const listSubscriptions = require('./listSubscriptions')
const configure = require('./configure')
const resetConfiguration = require('./resetConfiguration')
const emit = require('./emit')
const invoke = require('./invoke')
const urlUtils = require('./urlUtils')

const eventGateway = configuration => {
  if (
    isNil(configuration) ||
    typeof configuration !== 'object' ||
    isNil(configuration.url) ||
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
