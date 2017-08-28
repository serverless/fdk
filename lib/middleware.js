const R = require('ramda')

const middleware = (middlewares) => {
  middlewares = R.map((middle) => (next) => (event) => middle(event, next), middlewares)
  const midfn = R.apply(R.compose, middlewares)
  return (handler) => midfn(handler)
}

module.exports = middleware
