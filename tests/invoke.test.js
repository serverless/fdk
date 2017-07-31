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
      eventGateway = fdk.eventGateway({
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
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
  return eventGateway.registerFunction(functionConfig).then(response => {
    expect(response).toEqual(functionConfig)
  })
})

test('should invoke the function', () => {
  expect.assertions(2)
  return eventGateway
    .invoke({
      functionId: 'test-invoke',
      data: { name: 'Austen' },
    })
    .then(response => {
      expect(response.status).toEqual(200)
      return response.json()
    })
    .then(data => {
      expect(data).toEqual({ message: 'success' })
    })
})
