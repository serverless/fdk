const hkey = Symbol('handler key')

module.exports = class Handler {
  constructor(handler) {
    this[hkey] = handler
  }

  handler() {
    return (event, ctx, cb) => {
      const result = this[hkey](event, ctx, cb)

      if (result && typeof result.then === 'function') {
        result.then(val => {
          cb(null, val)
        }).catch(cb)
        return
      }
      cb(null, result)
    }
  }
}
