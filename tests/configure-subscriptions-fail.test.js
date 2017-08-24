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
  ],
  subscriptions: [
    { functionId: 'myFunctionOne', event: 'pageVisited' },
    { functionId: 'myFunctionTwo', event: 'userCreated' },
    { functionId: 'myFunctionTwo', event: 'pageVisited' },
  ],
}

let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4025,
      apiPort: 4026,
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

test('should fail to create multiple misconfigured subscriptions', () => {
  expect.assertions(1)
  return eventGateway.configure(config).catch(err => {
    expect(err).toMatchSnapshot()
  })
})
