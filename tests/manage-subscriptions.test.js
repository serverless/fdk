const fdk = require('../index')
const eventGatewayProcesses = require('./event-gateway/processes')

const functionConfig = {
  functionId: 'subscription-test-function',
  provider: {
    type: 'awslambda',
    arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/test',
    region: 'us-east-1',
  },
}

const subscriptionConfig = { functionId: 'hello', event: 'pageVisited' }

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4005,
      apiPort: 4006,
      // embedPeerPort: 4007,
      // embedCliPort: 4008,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        configurationProtocol: 'http',
        configurationPort: processInfo.configPort,
      })
    })
)

afterAll(() => {
  eventGatewayProcesses.shutDown(eventGatewayProcessId)
})

test('should add a function to the gateway', () => {
  expect.assertions(1)
  return eventGateway.addFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

// test('should add a subscription to the gateway', () => {
//   expect.assertions(1)
//   return eventGateway.addSubscription(subscriptionConfig).then(response => {
//     expect(response).toEqual({
//       functionId: 'hello',
//       event: 'pageVisited',
//       subscriptionId: 'pageVisited-hello',
//     })
//   })
// })

// test('should list the added subscriptions', () => {
//   expect.assertions(1)
//   return eventGateway.listSubscriptions().then(response => {
//     expect(response).toEqual({ subscriptions: [subscriptionConfig] })
//   })
// })
//
// test('should remove the added subscription', () => {
//   expect.assertions(1)
//   return eventGateway.deleteSubscription({ functionId: 'hello' }).then(response => {
//     expect(response).toBeUndefined()
//   })
// })
