/* eslint import/no-extraneous-dependencies: ["off"] */
/* eslint no-unused-expressions: 0 */
/* eslint func-names: 0 */
'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const Stdlib = require('./stdlib');
const AWS = require('aws-sdk');
const sinon = require('sinon').sandbox.create();
const chaiAsPromised = require('chai-as-promised');
require('sinon-as-promised');

const expect = chai.expect;
chai.use(sinonChai);
chai.use(chaiAsPromised);

describe('stdlib', () => {
  let lambda;
  let stdlib;

  beforeEach(() => {
    process.env.SERVERLESS_FUNC_test_ARN = 'arn';

    lambda = new AWS.Lambda();
    stdlib = new Stdlib(lambda);
  });

  afterEach(() => {
    sinon.restore();
  });

  describe('#call', () => {
    it('should callback error if function name not resolved', () => {
      process.env.SERVERLESS_FUNC_test_ARN = null;

      return expect(stdlib.call('')).to.be.rejectedWith(Error, 'Function ARN not found');
    });

    it('should callback parsed invocation result', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        Payload: '{"testKey": "testValue"}',
      });

      return expect(stdlib.call('test')).to.eventually.eql({
        testKey: 'testValue',
      });
    });

    it('should callback error if response not parsable', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        Payload: '{"testKey": "testValue"',
      });
      sinon.stub(JSON, 'parse').throws(new Error('end of JSON input'));

      return expect(stdlib.call('test'))
        .be.rejectedWith(Error, 'Parsing response failed: end of JSON input');
    });

    it('should callback error if response is error', () => {
      sinon.stub(lambda, 'invoke').yields(null, {
        StatusCode: 200,
        FunctionError: 'Unhandled',
        Payload: '{"errorMessage": "Process exited before completing request"}',
      });

      return expect(stdlib.call('test')).be
        .rejectedWith(Error, 'Calling function failed: Process exited before completing request');
    });

    it('should callback error if error occured', () => {
      sinon.stub(lambda, 'invoke').yields(new Error('Function not found'));

      stdlib.call('test', null);

      return expect(stdlib.call('test')).be
        .rejectedWith(Error, 'Calling function failed: Function not found');
    });

    it('should invoke req/res function', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      });

      stdlib.call('test', null);

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: 'null',
      });
    });

    it('should invoke function with provided argument as JSON string', () => {
      sinon.stub(lambda, 'invoke').returns({
        promise: sinon.stub().resolves({}),
      });

      stdlib.call('test', {
        key: 'value',
      });

      return expect(lambda.invoke).to.have.been.calledWith({
        FunctionName: 'arn',
        InvocationType: 'RequestResponse',
        Payload: '{"key":"value"}',
      });
    });

    it('should callback error if invocation takes longer than defined timeout', () => {
      const abort = sinon.spy();
      sinon.stub(lambda, 'invoke').returns({
        abort,
      });
      const clock = sinon.useFakeTimers();

      const result = stdlib.call('test', null, {
        timeout: 1000,
      });
      clock.tick(1000);

      expect(abort).to.have.been.calledOnce;
      return expect(result).be.rejectedWith(Error, 'Calling function failed: Timeout exceeded');
    });
  });

  describe('#handler', () => {
    it('should call provided function with event and callback', () => {
      const fn = sinon.spy();

      const event = {};
      const context = {};
      const callback = function () {};
      const handler = stdlib.handler(fn);
      handler(event, context, callback);

      expect(fn).to.have.been.calledWithExactly(event, callback);
    });
  });
});
