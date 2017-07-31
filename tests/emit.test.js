const fdk = require('../index')
const eventGatewayProcesses = require('./event-gateway/processes')
const http = require('http')

const requests = []
const serverPort = 3336
const server = http.createServer((request, response) => {
  requests.push(request)
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'success' }))
})

const functionConfig = {
  functionId: 'test-emit',
  provider: {
    type: 'http',
    url: `http://localhost:${serverPort}/test/path`,
  },
}
const subscription = {
  functionId: 'test-emit',
  event: 'pageVisited',
  subscriptionId: 'pageVisited-test-emit',
}
const subscriptionConfig = { functionId: 'test-emit', event: 'pageVisited' }
let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4013,
      apiPort: 4014,
    })
    .then(processInfo => {
      // TODO promisify listen
      server.listen(serverPort)
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        port: 4014,
        protocol: 'http',
        configurationProtocol: 'http',
        configurationPort: processInfo.configPort,
      })
    })
)

afterAll(done => {
  eventGatewayProcesses.shutDown(eventGatewayProcessId)
  server.close(() => {
    done()
  })
})

test('should add a function to the gateway', () => {
  expect.assertions(1)
  return eventGateway.addFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should add a subscription to the gateway', () => {
  expect.assertions(1)
  return eventGateway.addSubscription(subscriptionConfig).then(response => {
    expect(response).toEqual(subscription)
  })
})

test('should invoke the subscribed function when emitting an event', () => {
  expect.assertions(2)
  return eventGateway
    .emit({
      event: 'pageVisited',
      data: JSON.stringify({ userId: '1234' }),
    })
    .then(response => {
      expect(requests).toHaveLength(1)
      expect(response.status).toEqual(202)
    })
})
