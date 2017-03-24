/* eslint-env mocha */

'use strict';

const assert = require('assert');

const streams = require('../../lib/streams');

describe('streams', () => {
  describe('createPruneValidationStream', () => {
    it('no options, no config', () => {
      const output = streams.createPruneValidationStream();

      assert.strictEqual(Object.keys(output).length, 2);
      assert.strictEqual(output.type, 'raw');
      assert.ok(output.stream instanceof streams.PruneValidationStream);
    });
    it('options, no config', () => {
      const output = streams.createPruneValidationStream({
        type: 'foo',
        stream: process.stdout
      });

      assert.strictEqual(Object.keys(output).length, 2);
      assert.strictEqual(output.type, 'foo');
      assert.strictEqual(output.stream, process.stdout);
    });
    it('options, config', () => {
      const output = streams.createPruneValidationStream({}, {
        stream: process.stderr
      });

      assert.strictEqual(Object.keys(output).length, 2);
      assert.strictEqual(output.type, 'raw');
      assert.ok(output.stream instanceof streams.PruneValidationStream);
      assert.strictEqual(output.stream.stream, process.stderr);
    });
  });
});
