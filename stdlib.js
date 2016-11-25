'use strict';

class Stdlib {
  constructor(lambda) {
    this.lambda = lambda;
  }

  call(name, argument, options, cb) {
    let callback;
    let invokeRequest;

    if (typeof options === 'function') {
      callback = options;
    } else {
      callback = cb;
    }

    if (options && typeof options.timeout === 'number') {
      setTimeout(() => {
        invokeRequest.abort();
        callback(new Error('Calling function failed: Timeout exceeded'));
      }, options.timeout);
    }

    const arn = process.env[`SERVERLESS_FUNC_${name}_ARN`];
    if (!arn) {
      callback(new Error('Function ARN not found'));
    } else {
      const params = {
        FunctionName: arn,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(argument),
      };

      invokeRequest = this.lambda.invoke(params, (err, response) => {
        if (err) {
          callback(new Error(`Calling function failed: ${err.message}`));
        } else {
          let payload;
          try {
            payload = JSON.parse(response.Payload);

            if (response.FunctionError) {
              callback(new Error(`Calling function failed: ${payload.errorMessage}`));
            } else {
              callback(null, payload);
            }
          } catch (ex) {
            callback(new Error(`Parsing response failed: ${ex.message}`));
          }
        }
      });
    }
  }
}

module.exports = Stdlib;
