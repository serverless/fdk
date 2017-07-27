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

const createEventGatewayClient = options => {
  // TODO throw error if hostname is not defined
  if (options.hostname) {
    console.log()
  }

  const gatewayConfig = {
    gatewayConfig: {
      hostname: options.hostname,
      apiPort: options.port || 4000,
      configurationPort: options.configurationPort || 4001,
      protocol: options.protocol || 'http',
      // eslint-disable-next-line global-require
      fetch: options.fetch || require('isomorphic-fetch'),
    },
  }

  return {
    emit: params => emit(R.merge(params, gatewayConfig)),
    invoke: params => invoke(R.merge(params, gatewayConfig)),
    configure: params => configure(R.merge(params, gatewayConfig)),
    resetConfiguration: params => resetConfiguration(R.merge(params, gatewayConfig)),
    addFunction: params => addFunction(R.merge(params, gatewayConfig)),
    deleteFunction: params => deleteFunction(R.merge(params, gatewayConfig)),
    listFunctions: params => listFunctions(R.merge(params, gatewayConfig)),
    addSubscription: params => addSubscription(R.merge(params, gatewayConfig)),
    deleteSubscription: params => deleteSubscription(R.merge(params, gatewayConfig)),
    listSubscriptions: params => listSubscriptions(R.merge(params, gatewayConfig)),
  }
}

module.exports = {
  createEventGatewayClient,
  // TODO implement handler
}
