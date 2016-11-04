'use strict';

const AWS = require('aws-sdk');
const Stdlib = require('./stdlib');

module.exports = () => new Stdlib(new AWS.Lambda({
  apiVersion: '2015-03-31',
}));
