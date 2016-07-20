/* global global, describe, it */

'use strict';

const assert = require('assert');
const requestErrors = require('request-promise/errors');

const serializers = require('../lib/serializers');
const errorSerializer = serializers.error;
const errorValidation = require('../lib/serializers/error/error-validation');

describe('Error serializer', () => {
  it('aliases `e`, `err` and `error` exist and are the same serializer', () => {
    assert.notStrictEqual(serializers.e, undefined);
    assert.strictEqual(serializers.e, serializers.err);
    assert.strictEqual(serializers.err, serializers.error);
  });

  it('doesn\'t fail if missing parameters', () => {
    assert.doesNotThrow(() => {
      errorSerializer(null);
    });
  });

  it('returns passed argument if not a valid error', () => {
    assert.strictEqual(
      errorSerializer(null),
      null
    );
  });

  it('strips attributes not declared in validation schema', () => {
    const errorType = 'TypeError';
    const errorMessage = 'This is a test message';
    const undeclaredKey = 'undeclared';
    const undeclaredValue = 'This key is not declared in the JSON schema';
    const serializedError = errorSerializer(
      new (global[errorType])(errorMessage)
    );

    serializedError[undeclaredKey] = undeclaredValue;

    assert.strictEqual(
      errorValidation(serializedError),
      true
    );

    assert.strictEqual(undeclaredKey in serializedError, false);
  });

  it('serializes V8 native Error correctly', () => {
    const errorType = 'TypeError';
    const errorMessage = 'This is a test message';
    const serializedError = errorSerializer(
      new (global[errorType])(errorMessage)
    );

    assert.strictEqual(
      errorValidation(serializedError),
      true
    );

    assert.strictEqual(serializedError.name, errorType);
    assert.strictEqual(serializedError.message, errorMessage);
  });

  it('serializes request-promise RequestError correctly', () => {
    const errorCause = 'This is a test cause';
    const serializedError = errorSerializer(
      new (requestErrors.RequestError)(errorCause)
    );

    assert.strictEqual(
      errorValidation(serializedError),
      true
    );

    assert.strictEqual(serializedError.name, 'RequestError');
    assert.strictEqual(serializedError.message, errorCause);
    assert.strictEqual(serializedError.cause, errorCause);
  });

  it('serializes request-promise StatusCodeError correctly', () => {
    const errorMessage = 'This is a test message';
    const statusCode = 428;
    const serializedError = errorSerializer(
      new (requestErrors.StatusCodeError)(statusCode, errorMessage)
    );

    assert.strictEqual(
      errorValidation(serializedError),
      true
    );

    assert.strictEqual(serializedError.name, 'StatusCodeError');
    assert.strictEqual(serializedError.message, `${statusCode} - "${errorMessage}"`);
    assert.strictEqual(serializedError.statusCode, statusCode);
  });
});
