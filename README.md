# Function Development Kit

> This library is an **experiment**. API will probably change.

[![Build Status](https://travis-ci.org/serverless/fdk.svg?branch=master)](https://travis-ci.org/serverless/fdk)

Features:

- methods for service/functions communication,
- generic function handler with first-class Promise support

Supported providers:

- AWS Lambda

## API

### `fdk.handler(fn)` -> AWS Lambda compatible function

Generic function handler. `handler` wraps `fn` function and provides following features:

- handle returned value
- handle returned Promise

Options:

- fn - `function` - function to wrap. Function accepts following arguments:
  - event - event used to call AWS Lambda function
  - context - AWS Lambda context

Examples:

```javascript
const fdk = require('@serverless/fdk')

module.exports.hello = fdk.handler((event, ctx) => {
  return 'hello'
})
```

```javascript
const fdk = require('@serverless/fdk')

module.exports.createUser = fdk.handler((user, ctx) => {
  return fdk.invoke('saveToDB', user) // Promise returned
})
```

### `fdk.call(name, [argument], [options])` -> `Promise`

Invoke function

Options:

- name - `string` - function name,
- argument (optional) - any type - argument to pass to invoked function,
- options (optional) - `object`:
  - timeout - `number` - function invoke timeout in milliseconds. If function invocation exceeds timeout error is called back.
