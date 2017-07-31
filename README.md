# Function Development Kit

> This library is an **experiment**. API will probably change.

[![Build Status](https://travis-ci.org/serverless/fdk.svg?branch=master)](https://travis-ci.org/serverless/fdk)

## Install

```bash
npm install @serverless/fdk
```

## Create an Event Gateway Client

```js
const fdk = require('fdk');
const eventGateway = fdk.eventGateway({
  url: 'http://localhost',
})
```

Optional Properties for `eventGateway`

```js
{
  // defaults to the provide URL + the default configuration port for the Event Gateway 4001
  configurationUrl: 'http://localhost:4001'
  // optional property allowing the developer to provide their own http lib ideal for mocking
  // or to cover edge cases like passing in special headers
  fetchClient: fetch
}
```

## Configure an Event Gateway

Configure accepts an object of function and subscription definitions. The idea of exposing one configuration function is to provide developers with convenient utility to configure an Event Gateway in one call rather then dealing with a chain of Promise based calls. Nevertheless in addition we expose a wrapper function for each low-level API call to the Event Gateway

```js
eventGateway.configure({
  // list of all the functions that should be registered
  functions: [
    {
      functionId: "hello-world"
      provider: {
        type: "awslambda"
        arn: "xxx",
        region: "us-west-2",
      }
    },
    {
      functionId: "sendWelcomeMail"
      provider: {
        type: "gcloudfunction"
        name: "sendWelcomeEmail",
        region: "us-west-2",
      }
    }
  ],
  // list of all the subscriptions that should be created
  subscriptions: [
    {
      event: "http",
      method: "GET",
      path: "/users",
      functionId: "hello-world"
    },
    {
      event: "user.created",
      functionId: "sendEmail"
    }
  ]
})
```

### Result

Returns a promise which contains all the same list of functions and subscriptions in the same structure and order as provided in the configuration argument.

ES5

```js
eventGateway.configure({ config })
  .then((response) => {
    console.log(response)
    // {
    //   functions: [
    //     { functionId: 'xxx', … },
    //     { functionId: 'xxx', … }
    //   ],
    //   subscriptions: [
    //     { subscriptionId: 'xxx', … },
    //     { subscriptionId: 'xxx', … }
    //   ]
    // }
  })
```

ES2015

```js
const response = await eventGateway.configure({ config })
console.log(response)
```

### Internal Steps

1. Retrieve all the functions from the Event Gateway
2. Create or update all described functions
3. Create all described subscriptions

In the initial implementation the returned Promise is rejected, but there will be no attempt of retries or recovering a healthy state.

### Further Improvements

1. Allow to attach a `transactionId` or `ownerId` to each function and subscription so we can determine that a client only removes the functions and subscriptions created by itself.
2. Proper failure retries or recovery of the old state in case one or multiple requests fail.
3. Checking for valid configurations by fetching all existing functions and subscriptions and verify that there are no functions collisions nor invalid subscriptions to functions that don't exist.

## Reset the configuration

Reset removes all the existing subscriptions and functions.

```js
eventGateway.resetConfiguration()
```

### Internal Steps

1. Retrieve all the subscriptions from the Event Gateway
2. Remove all the existing subscriptions
3. Retrieve all the functions from the Event Gateway
4. Remove all the existing functions

## Invoke a Function

```js
eventGateway.invoke({
  functionId: "createUser",
  data: JSON.stringify({ name: "Austen" }),
})
```

Returns a Promise with the response.

## Emit an Event

```js
eventGateway.emit({
  event: "userCreated",
  data: JSON.stringify({ name: "Austen" }),
})
```

Returns a Promise and when resolved the response only indicates if the Event Gateway received the event.
Responses from any subscribed functions are not part of the response.

## Handler & Middlewares

A generic function handler with first-class Promise support.

```js
import { handler } from 'fdk';

module.exports.run = handler(event => {
  return { message: 'Success' }
})
```

Middlewares will be implemented at a later stage.

## Further Event Gateway Functions

```js
// Returns a function
eventGateway.registerFunction({
  functionId: "sendEmail"
  provider: {
    type: "awslambda"
    arn: "xxx",
    region: "us-west-2",
  }
})

// Returns undefined
eventGateway.deleteFunction({ functionId: "sendEmail" })

// Returns an Array of functions
eventGateway.listFunctions()

// Returns a subscription: { subscriptionId, event, functionId}
eventGateway.subscribe({
  event: "user.created",
  functionId: "sendEmail"
})

// Returns undefined
eventGateway.unsubscribe({
  subscriptionId: "user.created-sendEmail"
})

// Returns an Array of subscriptions
eventGateway.listSubscriptions()
```

## Development

```
npm install
```

```js
npm run test
```

We also highly recommend to check out the [Contributing](https://github.com/serverless/fdk/blob/master/CONTRIBUTING.md) document as it explains some of the design decisions for this library.
