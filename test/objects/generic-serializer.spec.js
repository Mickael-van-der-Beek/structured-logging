'use strict';

const assert = require('assert');

const genericSerializer = require('../../lib/objects/generic/generic-serializer');

describe('Generic serializer', () => {
  it('handle serialization error', () => {
    const serializer = () => {
      throw new Error('This is a test message');
    };
    const validator = () => {};
    const data = {};

    const result = genericSerializer(serializer, validator, data);

    assert.strictEqual(result.hasSerializationError, true);
    assert.strictEqual(result.serializationError.message, 'This is a test message');
  });
});
