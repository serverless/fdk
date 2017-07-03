module.exports = class FDK {
  constructor(lambda) {
    this.lambda = lambda
  }

  call(name, argument, options) {
    return new Promise((resolve, reject) => {
      let invokeRequest

      if (options && typeof options.timeout === 'number') {
        setTimeout(() => {
          invokeRequest.abort()
          reject(new Error('Calling function failed: Timeout exceeded'))
        }, options.timeout)
      }

      const params = {
        FunctionName: name,
        InvocationType: 'RequestResponse',
        Payload: JSON.stringify(argument),
      }

      invokeRequest = this.lambda.invoke(params, (err, response) => {
        if (err) {
          reject(new Error(`Calling function failed: ${err.message}`))
        } else {
          let payload
          try {
            payload = JSON.parse(response.Payload)

            if (response.FunctionError) {
              reject(new Error(`Calling function failed: ${payload.errorMessage}`))
            } else {
              resolve(payload)
            }
          } catch (ex) {
            reject(new Error(`Parsing response failed: ${ex.message}`))
          }
        }
      })
    })
  }

  trigger(name, payload) {
    const params = {
      FunctionName: name,
      InvocationType: 'Event',
      Payload: JSON.stringify(payload),
    }

    return this.lambda
      .invoke(params)
      .promise()
      .catch(err => Promise.reject(new Error(`Triggering function failed: ${err.message}`)))
  }
}
