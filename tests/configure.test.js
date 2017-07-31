const fdk = require('../index')
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
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        configurationProtocol: 'http',
        configurationPort: 4017,
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
