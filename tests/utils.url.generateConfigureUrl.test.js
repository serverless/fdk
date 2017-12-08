const urlUtils = require('../lib/utils/url')

test('should add the port 4001 to a url without a port', () => {
  expect(urlUtils.generateConfigureUrl('http://localhost')).toEqual('http://localhost:4001/')
})

test('should add the port 4001 to a url without a port and a slash', () => {
  expect(urlUtils.generateConfigureUrl('http://localhost/')).toEqual('http://localhost:4001/')
})

test('should replace the port with 4001', () => {
  expect(urlUtils.generateConfigureUrl('http://localhost:4000')).toEqual('http://localhost:4001/')
})

test('should replace the port with 4001 even if a slash exists', () => {
  expect(urlUtils.generateConfigureUrl('http://localhost:4000/')).toEqual('http://localhost:4001/')
})
