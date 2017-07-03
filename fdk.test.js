/* eslint import/no-extraneous-dependencies: 0 */
/* eslint node/no-unpublished-require: 0 */
/* eslint no-unused-expressions: 0 */
const chai = require('chai')
const sinonChai = require('sinon-chai')
const FDK = require('./fdk')
const AWS = require('aws-sdk')
const sinon = require('sinon').sandbox.create()
const chaiAsPromised = require('chai-as-promised')
require('sinon-as-promised')

const expect = chai.expect
chai.use(sinonChai)
chai.use(chaiAsPromised)

describe('FDK', () => {
  let lambda
  let fdk

  beforeEach(() => {
    lambda = new AWS.Lambda()
    fdk = new FDK(lambda)
  })

  afterEach(() => {
    sinon.restore()
  })

  describe('#invoke', () => {
    it('should callback parsed invocation result', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        Payload: '{"testKey": "testValue"}',
      })

      return expect(fdk.invoke('test')).to.eventually.eql({
        testKey: 'testValue',
      })
    })

    it('should callback error if response not parsable', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        Payload: '{"testKey": "testValue"',
      })
      sinon.stub(JSON, 'parse').throws(new Error('end of JSON input'))

      return expect(fdk.invoke('test')).be.rejectedWith(
        Error,
        'Parsing response failed: end of JSON input'
      )
    })

    it('should callback error if response is error', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: '{"errorMessage": "Process exited before completing request"}',
      })

      return expect(fdk.invoke('test')).be.rejectedWith(
        Error,
        'Calling function failed: Process exited before completing request'
      )
    })

    it('should callback error if error occured', () => {
      sinon.stub(lambda, 'invoke').yields(new Error('Function not found'))

      return expect(fdk.invoke('test')).be.rejectedWith(
        Error,
        'Calling function failed: Function not found'
      )
    })

    it('should invoke req/res function', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      })

      fdk.invoke('test', null)

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'test',
        InvocationType: 'RequestResponse',
        Payload: 'null',
      })
    })

    it('should invoke function with provided argument as JSON string', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      })

      fdk.invoke('test', {
        key: 'value',
      })

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'test',
        InvocationType: 'RequestResponse',
        Payload: '{"key":"value"}',
      })
    })

    it('should callback error if invocation takes longer than defined timeout', () => {
      const abort = sinon.spy()
      sinon.stub(lambda, 'invoke').returns({
        abort,
      })
      const clock = sinon.useFakeTimers()

      const result = fdk.invoke('test', null, {
        timeout: 1000,
      })
      clock.tick(1000)

      expect(abort).to.have.been.calledOnce
      return expect(result).be.rejectedWith(Error, 'Calling function failed: Timeout exceeded')
    })
  })

  describe('#trigger', () => {
    it('should invoke event function', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      })

      fdk.trigger('test', null)

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'test',
        InvocationType: 'Event',
        Payload: 'null',
      })
    })

    it('should invoke function with provided argument as JSON string', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      })

      fdk.trigger('test', {
        key: 'value',
      })

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'test',
        InvocationType: 'Event',
        Payload: '{"key":"value"}',
      })
    })

    it('should callback error if error occured', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().rejects(new Error('Function not found')),
      })

      return expect(fdk.trigger('test')).be.rejectedWith(
        Error,
        'Triggering function failed: Function not found'
      )
    })
  })
})
