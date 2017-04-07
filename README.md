# Serverless Standard Library for Node.js

> This library is an **experiment**. API will probably change.

[![Build Status](https://travis-ci.org/serverless/stdlib-node.svg?branch=master)](https://travis-ci.org/serverless/stdlib-node)

Features:

- methods for service/functions communication,
- generic function handler with first-class Promise support

Supported providers:

- AWS Lambda

## API

### `stdlib(fn)` -> `Handler`

Generic function handler. `stdlib(fn)` returns `Handler` object that wraps `fn` function and provides following features:

- handle returned value
- handle returned Promise

`Handler` object exposes `handler()` function that returns AWS Lambda compatible handler.

Options:

- fn - `function` - function to wrap. Function accepts following arguments:
  - event - event used to call AWS Lambda function
  - context - AWS Lambda context

Examples:

```javascript
const stdlib = require('stdlib')

const hello = stdlib((event, ctx) => {
  return 'hello'
})

module.exports.hello = createUser.handler()
```

```javascript
const stdlib = require('stdlib')

const createUser = stdlib((user, ctx) => {
  return stdlib.call('saveToDB', user)
})

module.exports.createUser = createUser.handler()
```

### `stdlib.call(name, [argument], [options])` -> `Promise`

Call function

Options:

- name - `string` - function name,
- argument (optional) - any type - argument to pass to called function,
- options (optional) - `object`:
  - timeout - `number` - function call timeout in milliseconds. If function call exceeds timeout error is called back.
