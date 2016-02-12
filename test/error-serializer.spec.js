/* global global, describe, it */

'use strict';

var requestErrors = require('request-promise/errors');
var assert = require('chai').assert;

var errorSerializer = require('../lib/serializers/error-serializer');

describe('Error serializer', function () {
  it('doesn\'t fail if missing parameters', function () {
    assert.doesNotThrow(function () {
      errorSerializer(null);
    });
  });

  it('returns passed argument if not a valid error', function () {
    assert.equal(errorSerializer(null), null);
  });

  it('serializes V8 native Error correctly', function () {
    var errorType = 'TypeError';
    var errorMessage = 'This is a test message';
    var serializedError = errorSerializer(
      new (global[errorType])(errorMessage)
    );

    assert.equal(serializedError.name, errorType);
    assert.equal(serializedError.message, errorMessage);
    assert.isAbove(serializedError.stack.length, 0);
  });

  it('serializes request-promise RequestError correctly', function () {
    var errorCause = 'This is a test cause';
    var serializedError = errorSerializer(
      new (requestErrors.RequestError)(errorCause)
    );

    assert.equal(serializedError.name, 'RequestError');
    assert.equal(serializedError.message, errorCause);
    assert.equal(serializedError.cause, errorCause);
    assert.isAbove(serializedError.stack.length, 0);
  });

  it('serializes request-promise StatusCodeError correctly', function () {
    var errorMessage = 'This is a test message';
    var statusCode = 428;
    var serializedError = errorSerializer(
      new (requestErrors.StatusCodeError)(statusCode, errorMessage)
    );

    assert.equal(serializedError.name, 'StatusCodeError');
    assert.equal(serializedError.message, statusCode + ' - ' + errorMessage);
    assert.equal(serializedError.statusCode, statusCode);
    assert.isAbove(serializedError.stack.length, 0);
  });
});
