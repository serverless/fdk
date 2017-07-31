const fdk = require('../index')
const eventGatewayProcesses = require('./event-gateway/processes')
const http = require('http')

const serverPort = 3335
const server = http.createServer((request, response) => {
  response.writeHead(200, { 'Content-Type': 'application/json' })
  response.end(JSON.stringify({ message: 'success' }))
})

const functionConfig = {
  functionId: 'test-invoke',
  provider: {
    type: 'http',
    url: `http://localhost:${serverPort}/test/path`,
  },
}
let eventGateway
let eventGatewayProcessId

beforeAll(() =>
  eventGatewayProcesses
    .spawn({
      configPort: 4009,
      apiPort: 4010,
    })
    .then(processInfo => {
      // TODO promisify listen
      server.listen(serverPort)
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.createEventGatewayClient({
        hostname: 'localhost',
        port: 4010,
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

test('should invoke the function', () => {
  expect.assertions(1)
  return eventGateway.invoke().then(response => {
    expect(response).toEqual({ functions: [functionConfig] })
  })
})
