'use strict';

var requestErrors = require('request-promise/errors');
var bunyan = require('bunyan');
var _ = require('underscore');

module.exports = function (err) {
  if (!err || !err.stack) {
    return err;
  }

  var serializedError = bunyan.stdSerializers.err(err);

  if (err instanceof requestErrors.StatusCodeError) {
    _.extend(
      serializedError,
      {
        statusCode: err.statusCode || (err.response && err.response.statusCode),
        body: err.response && err.response.body
      }
    );
  }

  if (err instanceof requestErrors.RequestError) {
    _.extend(
      serializedError,
      {
        cause: err.cause
      }
    );
  }

  return serializedError;
};
