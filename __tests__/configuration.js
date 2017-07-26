const path = require('path')
const spawn = require('child_process').spawn

let eventGatewayProcess

beforeAll(() => {
  const gatewayPath = path.join(__dirname, 'event-gateway', 'darwin_amd64', 'event-gateway')
  eventGatewayProcess = spawn(gatewayPath, ['--dev'], { stdio: 'inherit' })
})

afterAll(() => {
  eventGatewayProcess.stdin.pause()
  eventGatewayProcess.kill()
})

test('placholder', done => {
  setTimeout(() => {
    expect(true).toBeTruthy()
    done()
  }, 2000)
})
