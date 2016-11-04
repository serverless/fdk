/* eslint import/no-extraneous-dependencies: ["off"] */
'use strict';

const chai = require('chai');
const sinonChai = require('sinon-chai');
const Stdlib = require('./stdlib');
const AWS = require('aws-sdk');
const sinon = require('sinon').sandbox.create();

const expect = chai.expect;
chai.use(sinonChai);

describe('stdlib', () => {
  let lambda;
  let stdlib;
  let callback;

  beforeEach(() => {
    process.env.SERVERLESS_FUNC_test_ARN = 'arn';

    lambda = new AWS.Lambda();
    stdlib = new Stdlib(lambda);
    callback = sinon.spy();
  });

  afterEach(() => {
    sinon.restore();
  });

  it('should callback error if function name not resolved', () => {
    process.env.SERVERLESS_FUNC_test_ARN = null;
    stdlib.call('', null, callback);

    expect(callback).to.have.been.calledWithExactly(
      sinon.match
        .instanceOf(Error)
        .and(sinon.match.has('message', 'Function ARN not found'))
    );
  });

  it('should callback parsed invocation result', () => {
    sinon.stub(lambda, 'invoke').yields(null, {
      StatusCode: 200,
      Payload: '{"testKey": "testValue"}',
    });

    stdlib.call('test', null, callback);

    expect(callback).to.have.been.calledWithExactly(null, {
      testKey: 'testValue',
    });
  });

  it('should callback error if response not parsable', () => {
    sinon.stub(lambda, 'invoke').yields(null, {
      StatusCode: 200,
      Payload: '{"testKey": "testValue"',
    });
    sinon.stub(JSON, 'parse').throws(new Error('end of JSON input'));

    stdlib.call('test', null, callback);

    expect(callback).to.have.been.calledWithExactly(
      sinon.match
        .instanceOf(Error)
        .and(sinon.match.has(
          'message', 'Parsing response failed: end of JSON input'
        ))
    );
  });

  it('should callback error if response is error', () => {
    sinon.stub(lambda, 'invoke').yields(null, {
      StatusCode: 200,
      FunctionError: 'Unhandled',
      Payload: '{"errorMessage": "Process exited before completing request"}',
    });

    stdlib.call('test', null, callback);

    expect(callback).to.have.been.calledWithExactly(
      sinon.match
        .instanceOf(Error)
        .and(sinon.match.has(
          'message', 'Calling function failed: Process exited before completing request'
        ))
    );
  });

  it('should callback error if error occured', () => {
    sinon.stub(lambda, 'invoke').yields(new Error('Function not found'));

    stdlib.call('test', null, callback);

    expect(callback).to.have.been.calledWithExactly(
      sinon.match
        .instanceOf(Error)
        .and(sinon.match.has('message', 'Calling function failed: Function not found'))
    );
  });

  it('should invoke req/res function', () => {
    sinon.stub(lambda, 'invoke').yields(null, {});

    stdlib.call('test', null, callback);

    expect(lambda.invoke).to.have.been.calledWith({
      FunctionName: 'arn',
      InvocationType: 'RequestResponse',
      Payload: 'null',
    });
  });

  it('should invoke function with provided argument as JSON string', () => {
    sinon.stub(lambda, 'invoke').yields(null, {});

    stdlib.call('test', {
      key: 'value',
    }, callback);

    expect(lambda.invoke).to.have.been.calledWith({
      FunctionName: 'arn',
      InvocationType: 'RequestResponse',
      Payload: '{"key":"value"}',
    });
  });
});
