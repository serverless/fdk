const R = require('ramda')
const addFunction = require('./lib/addFunction')
const deleteFunction = require('./lib/deleteFunction')
const listFunctions = require('./lib/listFunctions')
const subscribe = require('./lib/subscribe')
const unsubscribe = require('./lib/unsubscribe')
const listSubscriptions = require('./lib/listSubscriptions')
const configure = require('./lib/configure')
const resetConfiguration = require('./lib/resetConfiguration')
const emit = require('./lib/emit')
const invoke = require('./lib/invoke')

const createEventGatewayClient = configuration => {
  if (
    R.isNil(configuration) ||
    typeof configuration !== 'object' ||
    R.isNil(configuration.hostname) ||
    typeof configuration.hostname !== 'string'
  ) {
    throw new Error(
      "Please provide an object with the property 'hostname' to createEventGatewayClient"
    )
  }

  const protocol = configuration.protocol || 'https'
  const configurationProtocol = configuration.configurationProtocol || 'https'
  const apiPort = configuration.port || 4000
  const configurationPort = configuration.configurationPort || 4001

  const config = {
    apiOrigin: `${protocol}://${configuration.hostname}:${apiPort}`,
    configurationOrigin: `${configurationProtocol}://${configuration.hostname}:${configurationPort}`,
    // eslint-disable-next-line global-require
    fetch: configuration.fetch || require('isomorphic-fetch'),
  }

  return {
    emit: params => emit(config, params),
    invoke: params => invoke(config, params),
    configure: params => configure(config, params),
    resetConfiguration: params => resetConfiguration(config, params),
    addFunction: params => addFunction(config, params),
    deleteFunction: params => deleteFunction(config, params),
    listFunctions: params => listFunctions(config, params),
    subscribe: params => subscribe(config, params),
    unsubscribe: params => unsubscribe(config, params),
    listSubscriptions: params => listSubscriptions(config, params),
  }
}

module.exports = {
  createEventGatewayClient,
  // TODO implement and export handler
}
