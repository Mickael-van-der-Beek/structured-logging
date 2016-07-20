/* global global, describe, it, afterEach */

'use strict';

const assert = require('assert');
const express = require('express');
const supertest = require('supertest');
const url = require('url');

const serializers = require('../lib/serializers');
const httpRequestSerializer = serializers.request;
const httpRequestValidation = require('../lib/serializers/http-request/http-request-validation');

describe('HTTP request serializer (server point of view)', () => {
  var server = null;

  afterEach('close HTTP server', function (callback) {
    if (server === null) {
      return callback();
    }

    server.close(callback);
  });

  it('aliases `req` and `request` and `error` exist and are the same serializer', () => {
    assert.notStrictEqual(serializers.req, undefined);
    assert.strictEqual(serializers.req, serializers.request);
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

  // it('strips attributes not declared in validation schema', (callback) => {
  //   const headerValue = 'This is a test referer';
  //   const headerKey = 'referer'.toLowerCase();
  //   const hostname = '::ffff:127.0.0.1';
  //   const pathname = '/pathname';
  //   const query = '?key=value';
  //   const hash = '#hash';
  //   const method = 'get';
  //   const port = 10000;

  //   const app = express();

  //   app.use(
  //     (req, res, next) => {
  //       const serializedHttpServerRequest = httpRequestSerializer(req);

  //       console.log(serializedHttpServerRequest);

  //       assert.strictEqual(
  //         httpRequestValidation(serializedHttpServerRequest),
  //         true
  //       );

  //       assert.strictEqual(serializedHttpServerRequest.isInternal, true);

  //       assert.strictEqual(serializedHttpServerRequest.method, method);

  //       assert.strictEqual(serializedHttpServerRequest.httpVersionMajor, 1);
  //       assert.strictEqual(serializedHttpServerRequest.isInternal, 1);

  //       assert.strictEqual(serializedHttpServerRequest.remoteAddresses, '::ffff:127.0.0.1');
  //       assert.strictEqual(serializedHttpServerRequest.remoteFamily, 'v4');

  //       assert.strictEqual(serializedHttpServerRequest.uri.protocol, 'http:');
  //       assert.strictEqual(serializedHttpServerRequest.uri.hostname, hostname);
  //       assert.strictEqual(serializedHttpServerRequest.uri.port, port);
  //       assert.strictEqual(serializedHttpServerRequest.uri.pathname, pathname);
  //       assert.strictEqual(serializedHttpServerRequest.uri.query, query);
  //       assert.strictEqual(serializedHttpServerRequest.uri.hash, hash);

  //       assert.strictEqual(serializedHttpServerRequest.headers.host, hostname + ':' + port);
  //       assert.strictEqual(serializedHttpServerRequest.headers[headerKey], headerValue);
  //     }
  //   );

  //   app[method](pathname, function (req, res) {
  //     res
  //       .status(200)
  //       .end();
  //   });

  //   server = app.listen(port, hostname, function (err) {
  //     if (err) {
  //       return callback(err);
  //     }

  //     supertest(app)[method](
  //         url.format({
  //           pathname,
  //           query,
  //           hash
  //         })
  //       )
  //       .set('Host', hostname + ':' + port)
  //       .set(headerKey, headerValue)
  //       .end(function (err, res) {
  //         if (err) {
  //           return callback(err);
  //         }
  //       });
  //   });
  // });

  it('serializes server-side HTTP requests correctly', (callback) => {
    const headerValue = 'This is a test referer';
    const headerKey = 'referer'.toLowerCase();
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const query = '?key=value';
    // const hash = '#hash';
    const method = 'GET';
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

        console.log(serializedHttpServerRequest);

        const isValid = httpRequestValidation(
          serializedHttpServerRequest,
          {
            v5: true,
            verbose: true
          }
        );

        console.log(httpRequestValidation.errors);

        try {
          assert.strictEqual(
            isValid,
            true
          );

          assert.strictEqual(serializedHttpServerRequest.isInternal, true);

          assert.strictEqual(serializedHttpServerRequest.method, method);

          assert.strictEqual(serializedHttpServerRequest.httpVersionMajor, 1);
          assert.strictEqual(serializedHttpServerRequest.isInternal, 1);

          assert.strictEqual(serializedHttpServerRequest.remoteAddresses, '::ffff:127.0.0.1');
          assert.strictEqual(serializedHttpServerRequest.remoteFamily, 'v4');

          assert.strictEqual(serializedHttpServerRequest.uri.protocol, 'http:');
          assert.strictEqual(serializedHttpServerRequest.uri.hostname, `[${hostname}]`);
          assert.strictEqual(serializedHttpServerRequest.uri.port, port);
          assert.strictEqual(serializedHttpServerRequest.uri.pathname, pathname);
          assert.strictEqual(serializedHttpServerRequest.uri.query, query);
          // assert.strictEqual(serializedHttpServerRequest.uri.hash, hash);

          assert.strictEqual(serializedHttpServerRequest.headers.host, `[${hostname}]:${port}`);
          assert.strictEqual(serializedHttpServerRequest.headers[headerKey], headerValue);
        } catch (err) {
          return callback(err);
        }

        callback(null);
      }
    );

    app[method.toLowerCase()](pathname, function (req, res) {
      res
        .status(200)
        .end();
    });

    server = app.listen(port, hostname, function (err) {
      if (err) {
        return callback(err);
      }

      supertest(app)[method.toLowerCase()](pathname)
        .query(query)
        .set('Host', `[${hostname}]:${port}`)
        .set(headerKey, headerValue)
        .end(function (err, res) {
          if (err) {
            return callback(err);
          }
        });
    });
  });
});
