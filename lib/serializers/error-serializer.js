'use strict';

var requestErrors = require('request-promise/errors');
var bunyan = require('bunyan');
var extend = require('extend');

module.exports = function (err) {
  if (!err || !err.stack) {
    return err;
  }

  var serializedError = bunyan.stdSerializers.err(err);

  if (err instanceof requestErrors.StatusCodeError) {
    return extend({
      statusCode: err.statusCode || (err.response && err.response.statusCode),
      body: err.response && err.response.body
    }, serializedError);
  }

  if (err instanceof requestErrors.RequestError) {
    return extend({
      cause: err.cause
    }, serializedError);
  }

  return serializedError;
};
