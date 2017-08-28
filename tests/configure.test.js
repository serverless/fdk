const fdk = require('../lib/index')
const eventGatewayProcesses = require('./event-gateway/processes')

const config = {
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

test('should created multiple functions and subscriptions with configure', () => {
  expect.assertions(1)
  return eventGateway.configure(config).then(response => {
    expect(response).toMatchSnapshot()
  })
})
