'use strict';

const assert = require('assert');

const stateSerializer = require('../../lib/objects/state').serializer;

describe('State serializer', () => {
  it('doesn\'t fail if missing parameters', () => {
    assert.doesNotThrow(() => {
      stateSerializer(null);
    });
  });

  it('serializes any type of JavaScript object correctly', () => {
    const numberVal = 43;
    const stringVal = 'foo';
    const valueVal = 'value';
    const arrayVal1 = 'hello';
    const arrayVal2 = 'world';
    const state = {
      number: numberVal,
      string: stringVal,
      object: {
        child: {
          key: valueVal
        }
      },
      array: [
        arrayVal1,
        arrayVal2
      ]
    };

    const serializedError = stateSerializer(state);

    assert.strictEqual(serializedError.number, numberVal);
    assert.strictEqual(serializedError.string, stringVal);
    assert.strictEqual(serializedError.object.child.key, valueVal);
    assert.strictEqual(serializedError.array[0], arrayVal1);
    assert.strictEqual(serializedError.array[1], arrayVal2);
  });
});
