# Serverless Standard Library for Node.js

Goals of Serverless Standard Library is providing:

- methods for service/functions communication,
- standard handler function that works across all providers,
- utility methods for enabled more powerful interaction with providers' resources.

## API

### `call(name, argument, [options], callback)`

Call function.

Options:

- name - `string` - function name,
- argument - any type - argument to pass to called function,
- options (optional) - `object`:
  - timeout - `number` - function call timeout in milliseconds. If function call exceeds timeout error is called back,
- callback - `function(error, result)`.