/* eslint func-names: 0 */

'use strict';

class Stdlib {
  constructor(lambda) {
    this.lambda = lambda;
  }

  call(name, argument, options) {
    return new Promise((resolve, reject) => {
      let invokeRequest;

      if (options && typeof options.timeout === 'number') {
        setTimeout(() => {
          invokeRequest.abort();
          reject(new Error('Calling function failed: Timeout exceeded'));
        }, options.timeout);
      }

      const arn = process.env[`SERVERLESS_FUNC_${name}_ARN`];
      if (!arn) {
        reject(new Error('Function ARN not found'));
      } else {
        const params = {
          FunctionName: arn,
          InvocationType: 'RequestResponse',
          Payload: JSON.stringify(argument),
        };

        invokeRequest = this.lambda.invoke(params, (err, response) => {
          if (err) {
            reject(new Error(`Calling function failed: ${err.message}`));
          } else {
            let payload;
            try {
              payload = JSON.parse(response.Payload);

              if (response.FunctionError) {
                reject(new Error(`Calling function failed: ${payload.errorMessage}`));
              } else {
                resolve(payload);
              }
            } catch (ex) {
              reject(new Error(`Parsing response failed: ${ex.message}`));
            }
          }
        });
      }
    });
  }

  handler(fn) {
    return function (e, ctx, cb) {
      fn(e, cb);
    };
  }
}

module.exports = Stdlib;
