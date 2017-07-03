/* eslint import/no-extraneous-dependencies: 0 */
/* eslint node/no-unpublished-require: 0 */
/* eslint no-unused-expressions: 0 */
/* eslint func-names: 0 */
const chai = require('chai')
const sinonChai = require('sinon-chai')
const sinon = require('sinon').sandbox.create()
const chaiAsPromised = require('chai-as-promised')
const Handler = require('./handler')
require('sinon-as-promised')

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('Handler', () => {
  it('should call provided function with event, context and callback', () => {
    const fn = sinon.spy()

    const event = {}
    const context = {}
    const callback = function () {}

    new Handler().handler(fn)(event, context, callback)

    expect(fn).to.have.been.calledWithExactly(event, context, callback)
  })

  it('should support returned promises', done => {
    const handler = new Handler().handler(
      () =>
        new Promise(resolve => {
          resolve('test')
        })
    )

    handler({}, {}, (err, data) => {
      expect(err).to.equal(null)
      expect(data).to.equal('test')
      done()
    })
  })

  it('should support returned value', done => {
    const handler = new Handler().handler(() => 'returnedValue')

    handler({}, {}, (err, data) => {
      expect(err).to.equal(null)
      expect(data).to.equal('returnedValue')
      done()
    })
  })

  it('should support thrown error', done => {
    const handler = new Handler().handler(() => {
      throw new Error('test')
    })

    handler({}, {}, (err, data) => {
      expect(err).to.be.an('error')
      expect(data).to.be.undefined
      done()
    })
  })
})
