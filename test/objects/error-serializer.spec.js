'use strict';

const assert = require('assert');
const requestErrors = require('request-promise/errors');

const errorSerializer = require('../../lib/objects/error').serializer;

describe('Error serializer', () => {
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

  it('handle validation errors', () => {
    const errorType = 'TypeError';
    const errorMessage = 'This is a test message';
    const errorCodeLengthLimit = 255;

    const error = new (global[errorType])(errorMessage);

    error.code = new Array(errorCodeLengthLimit + 2).join('a');

    const serializedError = errorSerializer(error);

    assert.strictEqual(serializedError.hasValidationErrors, true);
    assert.strictEqual(serializedError.validationErrors.length, 1);
  });

  it('serializes V8 native Error correctly', () => {
    const errorType = 'TypeError';
    const errorMessage = 'This is a test message';

    const error = new (global[errorType])(errorMessage);

    const serializedError = errorSerializer(error);

    assert.strictEqual(serializedError.name, errorType);
    assert.strictEqual(serializedError.message, errorMessage);
  });

  it('serializes request-promise RequestError correctly', () => {
    const errorCause = 'This is a test cause';

    const error = new (requestErrors.RequestError)(errorCause);

    const serializedError = errorSerializer(error);

    assert.strictEqual(serializedError.name, 'RequestError');
    assert.strictEqual(serializedError.message, errorCause);
    assert.strictEqual(serializedError.cause, errorCause);
  });

  it('serializes request-promise StatusCodeError correctly', () => {
    const errorMessage = 'This is a test message';
    const statusCode = 428;

    const error = new (requestErrors.StatusCodeError)(statusCode, errorMessage);

    const serializedError = errorSerializer(error);

    assert.strictEqual(serializedError.name, 'StatusCodeError');
    assert.strictEqual(serializedError.message, `${statusCode} - "${errorMessage}"`);
    assert.strictEqual(serializedError.statusCode, statusCode);
  });
});
