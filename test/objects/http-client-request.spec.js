'use strict';

const assert = require('assert');
const bunyan = require('bunyan');
const express = require('express');
const querystring = require('querystring');
const request = require('request-promise');
const url = require('url');

const httpRequestSerializer = require('../../lib/objects/http-request').serializer;
const clientMiddleware = require('../../lib/middlewares/client-middleware');

describe('HTTP request serializer (client point of view)', () => {
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

    function validateHttpClientRequest (log) {
      log = JSON.parse(log);

      const serializedHttpClientRequest = log.req;

      try {
        assert.strictEqual(serializedHttpClientRequest.method, method);

        assert.strictEqual(serializedHttpClientRequest.httpVersionMajor, 1);
        assert.strictEqual(serializedHttpClientRequest.httpVersionMinor, 1);

        assert.strictEqual(serializedHttpClientRequest.uri.protocol, 'http:');
        assert.strictEqual(serializedHttpClientRequest.uri.hostname, `${hostname}`);
        assert.strictEqual(serializedHttpClientRequest.uri.port, port);
        assert.strictEqual(serializedHttpClientRequest.uri.pathname, pathname);
        assert.strictEqual(serializedHttpClientRequest.uri.query, querystring.stringify(query));
        assert.strictEqual(serializedHttpClientRequest.uri.hash, null);

        assert.strictEqual(serializedHttpClientRequest.headers[headerKey], headerValue);
      } catch (err) {
        return callback(err);
      }

      callback(null);
    }

    const logger = bunyan.createLogger({
      name: 'structured-logging',
      serializers: {
        req: httpRequestSerializer,
        /**
         * Note: If you don't do this, you will run into a nasty, nasty bug.
         * The req object is mirrored to bunyan and contains the response object
         * as well in it's properties. So when the serialized log object is JSON
         * stringified, the res.headers will be considered as a Circular reference!
         */
        res: () => {}
      },
      stream: {
        write: validateHttpClientRequest
      }
    });

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

    app[method.toLowerCase()](pathname, (req, res) => {
      res
        .status(200)
        .end();
    });

    server = app.listen(port, hostname, (err) => {
      if (err) {
        return callback(err);
      }

      request({
        uri: url.format({
          protocol: 'http',
          hostname,
          port,
          pathname,
          query
        }),

        method,

        headers: {
          [headerKey]: headerValue
        },

        resolveWithFullResponse: true
      })
      .then(
        clientMiddleware(logger, {})
      )
      .catch(
        err => callback(err)
      );
    });
  });
});
