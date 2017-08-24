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
      },
    },
  ],
  subscriptions: [{ functionId: 'myFunctionOne', event: 'pageVisited' }],
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4023,
      apiPort: 4024,
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

test('should fail to create multiple misconfigured functions', () => {
  expect.assertions(1)
  return eventGateway.configure(config).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
