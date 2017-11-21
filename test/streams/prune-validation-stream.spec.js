/* eslint-env mocha */

'use strict';

const assert = require('assert');

const PruneValidationStream = require('../../lib/streams/prune-validation-stream');

describe('PruneValidationStream', () => {
  it('constructor', () => {
    [
      [new PruneValidationStream(), { stream: process.stdout }],
      [new PruneValidationStream(null), { stream: process.stdout }],
      [new PruneValidationStream({ stream: process.stderr }), { stream: process.stderr }]
    ].forEach(row => {
      const output = row[0];
      const expected = row[1];

      assert.deepEqual(output, expected);
    });
  });
  it('sanitizeKey', () => {
    [
      ['foo_bar', 'foo_bar'],
      ['foo-bar', 'foo_bar'],
      ['__foo_bar__', 'xxfoo_barxx'],
      ['1foo2bar3', 'xfoo2bar3'],
      ['âàfoo%+bar€$', 'xxfooxxbarxx'],
      ['xxfoo_barxx', 'xxfoo_barxx']
    ].forEach(row => {
      const input = row[0];
      const expected = row[1];

      const instance = new PruneValidationStream();
      const output = instance.sanitizeKey(input);

      assert.strictEqual(output, expected);
    });
  });
  it('prune', () => {
    [
      [
        [{ foo: {} }, { foo: 'bar' }],
        [{ foo: 'bar' }, {}]
      ],
      [
        [{ foo: {} }, { bar: 'foo' }],
        [{}, { bar: 'foo' }]
      ],
      [
        [{ foo: {} }, { bar: 'foo', foo: 'bar' }],
        [{ foo: 'bar' }, { bar: 'foo' }]
      ]
    ].forEach(row => {
      const input = row[0];
      const expected = row[1];

      const instance = new PruneValidationStream();
      const output = instance.prune.apply(instance, input);

      assert.deepEqual(input[1], expected[0]);
      assert.deepEqual(output, expected[1]);
    });
  });
  it('validate', () => {
    const validationErrors = [{
      keyword: 'type',
      dataPath: '.foo',
      schemaPath: '#/properties/foo/type',
      params: {
        type: 'string'
      },
      message: 'should be string'
    }];
    let validator = null;

    [
      [
        [() => true, { foo: 'bar' }],
        { foo: 'bar' }
      ],
      [
        [(validator = () => false, validator.errors = validationErrors, validator), { foo: 42 }],
        { hasValidationErrors: true, validationErrors }
      ]
    ].forEach(row => {
      const input = row[0];
      const expected = row[1];

      const instance = new PruneValidationStream();
      instance.validate.apply(instance, input);

      assert.deepEqual(input[1], expected);
    });
  });
  it('serialize', () => {
    const validationErrors = [{
      keyword: 'type',
      dataPath: '.foo',
      schemaPath: '#/properties/foo/type',
      params: {
        type: 'string'
      },
      message: 'should be string'
    }];
    let validator = null;

    const circularObject = { name: 'test' };
    circularObject.test = circularObject;

    [
      [
        [{ name: {}, foo: {} }, () => true, { name: 'test', foo: 'bar' }],
        '{"name":"test","foo":"bar"}'
      ],
      [
        [{ name: {} }, () => true, { name: 'test', foo: 'bar' }],
        '{"name":"test","test":{"foo":"bar"}}'
      ],
      [
        [{ name: {} }, () => true, { name: '1test', foo: 'bar' }],
        '{"name":"1test","xtest":{"foo":"bar"}}'
      ],
      [
        [{ name: {}, foo: {} }, (validator = () => false, validator.errors = validationErrors, validator), { name: 'test', foo: 42 }],
        `{"name":"test","hasValidationErrors":true,"validationErrors":${JSON.stringify(validationErrors)}}`
      ],
      [
        [{ name: {} }, () => true, circularObject],
        '{"name":"test","test":{"test":"[Circular ~]"}}'
      ]
    ].forEach(row => {
      const input = row[0];
      const expected = row[1];

      const instance = new PruneValidationStream();
      const output = instance.serialize.apply(instance, input);

      assert.strictEqual(output, expected);
      assert.strictEqual(JSON.stringify(JSON.parse(output)), output);
    });
  });
  it('write', () => {
    const validationErrors = [{
      keyword: 'type',
      dataPath: '.pid',
      schemaPath: '#/properties/pid/type',
      params: {
        type: 'integer'
      },
      message: 'should be integer'
    }];

    [
      [
        '{"name":"test","foo":"bar"}',
        '{"name":"test","test":{"foo":"bar"}}\n'
      ],
      [
        { name: 'test', foo: 'bar' },
        '{"name":"test","test":{"foo":"bar"}}\n'
      ],
      [
        { name: 'test', foo: 'bar' },
        '{"name":"test","test":{"foo":"bar"}}\n'
      ],
      [
        { name: '1test', foo: 'bar' },
        '{"name":"1test","xtest":{"foo":"bar"}}\n'
      ],
      [
        { name: 'test', pid: 'foo' },
        `{"name":"test","hasValidationErrors":true,"validationErrors":${JSON.stringify(validationErrors)}}\n`
      ]
    ].forEach(row => {
      const input = row[0];
      const expected = row[1];

      const instance = new PruneValidationStream();

      instance.stream = {
        write: output => {
          assert.strictEqual(output, expected);
          assert.strictEqual(JSON.stringify(JSON.parse(output.slice(0, -1))), output.slice(0, -1));

          return 42;
        }
      };

      const output = instance.write(input);

      assert.strictEqual(output, 42);
    });
  });
  it('Bunyan time key serialized to JSON string', () => {
    const date = new Date();
    const input = [{ name: {}, time: {} }, () => true, { name: 'test', time: date }];
    const expected = `{"name":"test","time":"${date.toJSON()}"}`;

    const instance = new PruneValidationStream();
    const output = instance.serialize.apply(instance, input);

    assert.strictEqual(output, expected);
    assert.strictEqual(JSON.stringify(JSON.parse(output)), output);
  });
});
