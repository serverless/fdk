const fdk = require('../lib/index')
const eventGatewayProcesses = require('./event-gateway/processes')

const functionConfig = {
  functionId: 'hello',
  provider: {
    type: 'awslambda',
    arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/prod/users',
    region: 'us-east-1',
  },
}
let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4001,
      apiPort: 4002,
      // embedPeerPort: 4003,
      // embedCliPort: 4004,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.eventGateway({
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
      })
    })
)

afterAll(() => {
  eventGatewayProcesses.shutDown(eventGatewayProcessId)
})

test('should return an empty list for a new gateway', () => {
  expect.assertions(1)
  return eventGateway.listFunctions().then(response => {
    expect(response).toEqual({ functions: [] })
  })
})

test('should add a function to the gateway', () => {
  expect.assertions(1)
  return eventGateway.registerFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should list the added function', () => {
  expect.assertions(1)
  return eventGateway.listFunctions().then(response => {
    expect(response).toEqual({ functions: [functionConfig] })
  })
})

test('should fail to re-add the same function', () => {
  expect.assertions(1)
  return eventGateway.registerFunction(functionConfig).catch(err => {
    expect(err).toMatchSnapshot()
  })
})

test('should remove the added function', () => {
  expect.assertions(1)
  return eventGateway.deleteFunction({ functionId: 'hello' }).then(response => {
    expect(response).toBeUndefined()
  })
})

test('should fail to remove a none-existing function', () => {
  expect.assertions(1)
  return eventGateway.deleteFunction({ functionId: 'missing-func' }).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
