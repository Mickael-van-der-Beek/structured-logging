'use strict';

const assert = require('assert');

const PruneStream = require('../../lib/streams/prune-stream');

describe('PruneStream', () => {
  it('constructor', () => {
    assert.doesNotThrow(
      () => new PruneStream()
    );
  });
  it('write', () => {
    assert.doesNotThrow(
      () => {
        const pruneStream = new PruneStream();

        pruneStream.write({
          hello: 'world'
        });
      }
    );
  });
  it('write prunes non serializer aliased keys', callback => {
    const wrapPruneStreamWrite = function (data) {
      data = JSON.parse(data);

      assert.strictEqual(data.luz, undefined);
      assert.strictEqual(data.error.name, 'MyError');
      assert.strictEqual(data.error.message, 'This is a test error');
      assert.strictEqual(data.error.stack, 'Some error in some file');

      callback(null);
    };

    const pruneStream = new PruneStream();

    pruneStream.stream = {
      write: wrapPruneStreamWrite
    };

    pruneStream.write({
      error: {
        name: 'MyError',
        message: 'This is a test error',
        stack: 'Some error in some file'
      },
      lulz: {
        hello: 'world'
      }
    });
  });
});
