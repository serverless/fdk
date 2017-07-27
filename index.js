const R = require('ramda')
const addFunction = require('./lib/addFunction')
const deleteFunction = require('./lib/deleteFunction')
const listFunctions = require('./lib/listFunctions')
const addSubscription = require('./lib/addSubscription')
const deleteSubscription = require('./lib/deleteSubscription')
const listSubscriptions = require('./lib/listSubscriptions')
const configure = require('./lib/configure')
const resetConfiguration = require('./lib/resetConfiguration')
const emit = require('./lib/emit')
const invoke = require('./lib/invoke')

const createEventGatewayClient = config => {
  if (
    R.isNil(config) ||
    typeof config !== 'object' ||
    R.isNil(config.hostname) ||
    typeof config.hostname !== 'string'
  ) {
    throw new Error(
      "Please provide an object with the property 'hostname' to createEventGatewayClient"
    )
  }

  const protocol = config.protocol || 'http'
  const configurationProtocol = config.configurationPort || 4001
  const apiPort = config.port || 4000
  const configurationPort = config.configurationPort || 4001

  const gatewayConfig = {
    gatewayConfig: {
      hostname: config.hostname,
      apiOrigin: `${protocol}://${config.hostname}:${apiPort}`,
      configurationOrigin: `${configurationProtocol}://${config.hostname}:${configurationPort}`,
      // eslint-disable-next-line global-require
      fetch: config.fetch || require('isomorphic-fetch'),
    },
  }

  return {
    emit: params => emit(gatewayConfig, params),
    invoke: params => invoke(gatewayConfig, params),
    configure: params => configure(gatewayConfig, params),
    resetConfiguration: params => resetConfiguration(gatewayConfig, params),
    addFunction: params => addFunction(gatewayConfig, params),
    deleteFunction: params => deleteFunction(gatewayConfig, params),
    listFunctions: params => listFunctions(gatewayConfig, params),
    addSubscription: params => addSubscription(gatewayConfig, params),
    deleteSubscription: params => deleteSubscription(gatewayConfig, params),
    listSubscriptions: params => listSubscriptions(gatewayConfig, params),
  }
}

module.exports = {
  createEventGatewayClient,
  // TODO implement and export handler
}
