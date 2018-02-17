const fdk = require('../lib/index')
const eventGatewayProcesses = require('./event-gateway/processes')

const step1 = {
  functions: [
    {
      functionId: 'myFunctionOne',
      provider: {
        type: 'awslambda',
        arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/test',
        region: 'us-east-1',
      },
    },
    {
      functionId: 'myFunctionTwo',
      provider: {
        type: 'http',
        url: 'http://www.example.com',
      },
    },
  ],
  subscriptions: [
    { functionId: 'myFunctionOne', event: 'pageVisited' },
    { functionId: 'myFunctionOne', event: 'userCreated' },
  ],
}

const step2 = {
  functions: [
    {
      functionId: 'myFunctionOne',
      provider: {
        type: 'awslambda',
        arn: 'https://xxxxxxxxxx.execute-api.us-east-1.amazonaws.com/dev/test',
        region: 'us-east-1',
      },
    },
    {
      functionId: 'myFunctionTwo',
      provider: {
        type: 'http',
        url: 'http://www.example.com',
      },
    },
    {
      functionId: 'myFunctionThree',
      provider: {
        type: 'http',
        url: 'http://www.google.com',
      },
    },
  ],
  subscriptions: [
    { functionId: 'myFunctionOne', event: 'pageVisited' },
    { functionId: 'myFunctionOne', event: 'userCreated' },
    { functionId: 'myFunctionTwo', event: 'userDeleted' },
    { functionId: 'myFunctionThree', event: 'userUpdated' },
  ],
}

const step3 = {
  functions: [],
  subscriptions: [],
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4017,
      apiPort: 4018,
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

test('should created multiple functions and subscriptions if there are none', () => {
  expect.assertions(1)
  return eventGateway
    .deploy(step1)
    .then(response => { expect(response).toMatchSnapshot() })
})

test('should create added functions and subscriptions', () => {
  expect.assertions(2)
  return eventGateway
    .deploy(step1)
    .then(response => { expect(response).toMatchSnapshot('step1') })
    .then(() => eventGateway.deploy(step2))
    .then(response => { expect(response).toMatchSnapshot('step2') })
})

test('should delete functions and subscriptions', () => {
  expect.assertions(2)
  return eventGateway
    .deploy(step1)
    .then(response => { expect(response).toMatchSnapshot('step1') })
    .then(() => eventGateway.deploy(step3))
    .then(response => { expect(response).toMatchSnapshot('step3') })
})
