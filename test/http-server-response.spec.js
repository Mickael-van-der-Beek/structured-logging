/* global global, describe, it, afterEach */

'use strict';

const assert = require('assert');
const bunyan = require('bunyan');
const express = require('express');
const supertest = require('supertest');

const httpResponseSerializer = require('../lib/objects/http-response').serializer;
const serverMiddleware = require('../lib/middlewares').server;

describe('HTTP response serializer (server point of view)', () => {
  var server = null;

  afterEach('close HTTP server', callback => {
    if (server === null) {
      return callback();
    }

    server.close(callback);
  });

  it('doesn\'t fail if missing parameters', () => {
    assert.doesNotThrow(() => {
      httpResponseSerializer(null);
    });
  });

  it('returns passed argument if not a valid error', () => {
    assert.strictEqual(
      httpResponseSerializer(null),
      null
    );
  });

  it('serializes server-side HTTP responses correctly', callback => {
    const headerValue = 'This is a test server';
    const headerKey = 'server'.toLowerCase();
    const statusCode = 204;
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const method = 'GET';
    const port = 10000;

    function validateResponseLog (log) {
      log = JSON.parse(log);

      const serializedHttpServerResponse = log.res;

      try {
        assert.strictEqual(serializedHttpServerResponse.hasSerializationError, false);
        assert.strictEqual(serializedHttpServerResponse.serializationError, null);

        assert.strictEqual(serializedHttpServerResponse.hasValidationErrors, false);
        assert.strictEqual(serializedHttpServerResponse.validationErrors, null);

        assert.strictEqual(serializedHttpServerResponse.status, statusCode);

        assert.strictEqual(serializedHttpServerResponse.time > 0, true);
        assert.strictEqual(serializedHttpServerResponse.time < 1000, true);

        assert.strictEqual(serializedHttpServerResponse.headers[headerKey], headerValue);
      } catch (err) {
        return callback(err);
      }

      callback(null);
    }

    const logger = bunyan.createLogger({
      name: 'structured-logging',
      serializers: {
        res: httpResponseSerializer,
        /**
         * Note: If you don't do this, you will run into a nasty, nasty bug.
         * The req object is mirrored to bunyan and contains the response object
         * as well in it's properties. So when the serialized log object is JSON
         * stringified, the res.headers will be considered as a Circular reference!
         */
        req: () => {}
      },
      stream: {
        write: validateResponseLog
      }
    });

    const app = express();

    app.use(
      serverMiddleware(
        logger,
        {}
      )
    );

    app[method.toLowerCase()](pathname, (req, res) => {
      res
        .set(headerKey, headerValue)
        .status(statusCode)
        .end();
    });

    server = app.listen(port, hostname, err => {
      if (err) {
        return callback(err);
      }

      supertest(app)[method.toLowerCase()](pathname)
        .set('Host', `[${hostname}]:${port}`)
        .end((err, res) => {
          if (err) {
            return callback(err);
          }
        });
    });
  });
});
