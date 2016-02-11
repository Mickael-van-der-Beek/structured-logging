/* global global, describe, it */

'use strict';

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

  it('serializes error correctly', function () {
    var errorType = 'TypeError';
    var errorMessage = 'This is a test message';
    var serializedError = errorSerializer(
      new (global[errorType])(errorMessage)
    );

    assert.equal(serializedError.name, errorType);
    assert.equal(serializedError.message, errorMessage);
    assert.isAbove(serializedError.stack.length, 0);
  });
});
