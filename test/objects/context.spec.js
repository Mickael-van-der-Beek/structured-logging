'use strict';

const assert = require('assert');

const contextSerializer = require('../../lib/objects/context').serializer;

describe('Context serializer', () => {
  it('doesn\'t fail if missing parameters', () => {
    assert.doesNotThrow(() => {
      contextSerializer(null);
    });
  });

  it('serializes any type of JavaScript object correctly', () => {
    const numberVal = 43;
    const stringVal = 'foo';
    const valueVal = 'value';
    const arrayVal1 = 'hello';
    const arrayVal2 = 'world';
    const context = {
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

    const serializedError = contextSerializer(context);

    assert.strictEqual(serializedError.number, numberVal);
    assert.strictEqual(serializedError.string, stringVal);
    assert.strictEqual(serializedError.object.child.key, valueVal);
    assert.strictEqual(serializedError.array[0], arrayVal1);
    assert.strictEqual(serializedError.array[1], arrayVal2);
  });
});
