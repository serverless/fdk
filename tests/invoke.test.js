const fdk = require('../lib/index')
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

beforeAll(done =>
  eventGatewayProcesses
    .spawn({
      configPort: 4009,
      apiPort: 4010,
    })
    .then(processInfo => {
      eventGatewayProcessId = processInfo.id
      eventGateway = fdk.eventGateway({
        url: `http://localhost:${processInfo.apiPort}`,
        configurationUrl: `http://localhost:${processInfo.configPort}`,
      })
      server.listen(serverPort, err => {
        if (!err) {
          done()
        }
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

test('should invoke the function with dataType text/plain', () => {
  expect.assertions(2)
  return eventGateway
    .invoke({
      functionId: 'test-invoke',
      data: 'test message',
      dataType: 'text/plain',
    })
    .then(response => {
      expect(response.status).toEqual(200)
      return response.json()
    })
    .then(data => {
      expect(data).toEqual({ message: 'success' })
    })
})

test('should invoke the function with dataType application/octet-stream', () => {
  expect.assertions(2)
  return eventGateway
    .invoke({
      functionId: 'test-invoke',
      data: Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]),
      dataType: 'application/octet-stream',
    })
    .then(response => {
      expect(response.status).toEqual(200)
      return response.json()
    })
    .then(data => {
      expect(data).toEqual({ message: 'success' })
    })
})
