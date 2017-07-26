const path = require('path')
const spawn = require('child_process').spawn

let eventGatewayProcess

beforeAll(() => {
  const gatewayPath = path.join(__dirname, 'event-gateway', 'darwin_amd64', 'event-gateway')
  eventGatewayProcess = spawn(gatewayPath)
})

afterAll(() => {
  eventGatewayProcess.stdin.pause()
  eventGatewayProcess.kill()
})

test('placholder', () => {
  expect(true).toBeTruthy()
})
