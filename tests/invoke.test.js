const fdk = require('../index')
const eventGatewayProcesses = require('./event-gateway/processes')

const functionConfig = {
  functionId: 'test-invoke',
  provider: {
    type: 'http',
    url: 'http://localhost:3334/test/path',
  },
}
let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  // TODO spin up server for the function endpoint
  eventGatewayProcesses
    .spawn({
      configPort: 4009,
      apiPort: 4010,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        port: 4010,
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

test('should invoke the function', () => {
  expect.assertions(1)
  return eventGateway.invoke().then(response => {
    expect(response).toEqual({ functions: [functionConfig] })
  })
})
