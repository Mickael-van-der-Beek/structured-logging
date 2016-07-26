/* global global, describe, it, afterEach */

'use strict';

const assert = require('assert');
const express = require('express');
const querystring = require('querystring');
const supertest = require('supertest');

const httpRequestSerializer = require('../lib/objects/http-request').serializer;

describe('HTTP request serializer (server point of view)', () => {
  var server = null;

  afterEach('close HTTP server', callback => {
    if (server === null) {
      return callback();
    }

    server.close(callback);
  });

  it('doesn\'t fail if missing parameters', () => {
    assert.doesNotThrow(() => {
      httpRequestSerializer(null);
    });
  });

  it('returns passed argument if not a valid error', () => {
    assert.strictEqual(
      httpRequestSerializer(null),
      null
    );
  });

  it('serializes server-side HTTP requests correctly', callback => {
    const headerValue = 'This is a test referer';
    const headerKey = 'referer'.toLowerCase();
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const method = 'GET';
    const query = {
      key: 'value'
    };
    const port = 10000;

    const app = express();

    /*
     * Note: This setting is important because some data is derived from non-trusted
     * data sources like the `Host` header and `X-Forwarded-*` headers.
     */
    app.set(
      'trust proxy',
      [
        'loopback',
        'linklocal',
        'uniquelocal'
      ]
    );

    app.use(
      (req, res, next) => {
        const serializedHttpServerRequest = httpRequestSerializer(req);

        try {
          assert.strictEqual(serializedHttpServerRequest.hasSerializationError, false);
          assert.strictEqual(serializedHttpServerRequest.serializationError, null);

          assert.strictEqual(serializedHttpServerRequest.hasValidationErrors, false);
          assert.strictEqual(serializedHttpServerRequest.validationErrors, null);

          assert.strictEqual(serializedHttpServerRequest.isInternal, true);

          assert.strictEqual(serializedHttpServerRequest.method, method);

          assert.strictEqual(serializedHttpServerRequest.httpVersionMajor, 1);
          assert.strictEqual(serializedHttpServerRequest.httpVersionMinor, 1);

          assert.strictEqual(serializedHttpServerRequest.remoteAddresses[0], '::ffff:127.0.0.1');
          assert.strictEqual(serializedHttpServerRequest.remoteFamily, 'IPv6');
          assert.strictEqual(typeof serializedHttpServerRequest.remotePort, 'number');
          assert.strictEqual(serializedHttpServerRequest.remotePort > 0, true);
          assert.strictEqual(serializedHttpServerRequest.remotePort < Math.pow(2, 16), true);

          assert.strictEqual(serializedHttpServerRequest.uri.protocol, 'http:');
          assert.strictEqual(serializedHttpServerRequest.uri.hostname, `${hostname}`);
          assert.strictEqual(serializedHttpServerRequest.uri.port, port);
          assert.strictEqual(serializedHttpServerRequest.uri.pathname, pathname);
          assert.strictEqual(serializedHttpServerRequest.uri.query, querystring.stringify(query));
          assert.strictEqual(serializedHttpServerRequest.uri.hash, null);

          assert.strictEqual(serializedHttpServerRequest.headers.host, `[${hostname}]:${port}`);
          assert.strictEqual(serializedHttpServerRequest.headers[headerKey], headerValue);
        } catch (err) {
          return callback(err);
        }

        callback(null);
      }
    );

    app[method.toLowerCase()](pathname, (req, res) => {
      res
        .status(200)
        .end();
    });

    server = app.listen(port, hostname, err => {
      if (err) {
        return callback(err);
      }

      supertest(app)[method.toLowerCase()](pathname)
        .query(query)
        .set('Host', `[${hostname}]:${port}`)
        .set(headerKey, headerValue)
        .end((err, res) => {
          if (err) {
            return callback(err);
          }
        });
    });
  });
});
