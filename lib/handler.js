'use strict'

module.exports = class Handler {
  handler(original) {
    return (event, ctx, cb) => {
      try {
        const result = original(event, ctx, cb)

        if (result && typeof result.then === 'function') {
          result
            .then(val => {
              cb(null, val)
            })
            .catch(cb)
          return
        }
        cb(null, result)
      } catch (ex) {
        cb(ex)
      }
    }
  }
}
