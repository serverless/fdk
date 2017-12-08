const urlUtils = require('../lib/utils/url')

test('should join a url with a slash + a path with a slash', () => {
  expect(urlUtils.joinUrlWithPath('http://localhost', '/test')).toEqual('http://localhost/test')
})

test('should join a url with a slash + a path without a slash', () => {
  expect(urlUtils.joinUrlWithPath('http://localhost/', 'test')).toEqual('http://localhost/test')
})

test('should join a url without a slash + a path with a slash', () => {
  expect(urlUtils.joinUrlWithPath('http://localhost', '/test')).toEqual('http://localhost/test')
})

test('should join a url without a slash + a path without a slash', () => {
  expect(urlUtils.joinUrlWithPath('http://localhost', 'test')).toEqual('http://localhost/test')
})
