'use strict';

const assert = require('assert');
const express = require('express');
const request = require('request-promise');
const url = require('url');

const httpResponseSerializer = require('../../lib/objects/http-response').serializer;

describe('HTTP response serializer (client point of view)', () => {
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

  it.only('serializes client-side HTTP responses correctly', callback => {
    const includedHeaderValue = 'This is a test included header';
    const excludedHeaderValue = 'This is a test excluded header';
    const includedHeaderKey = 'server';
    const excludedHeaderKey = 'excluded';
    const statusCode = 204;
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const method = 'GET';
    const port = 10000;

    const app = express();

    app[method.toLowerCase()](pathname, (req, res) => {
      res
        .set(includedHeaderKey, includedHeaderValue)
        .set(excludedHeaderKey, excludedHeaderValue)
        .status(statusCode)
        .end();
    });

    server = app.listen(port, hostname, err => {
      if (err) {
        return callback(err);
      }

      request({
        uri: url.format({
          protocol: 'http',
          hostname,
          port,
          pathname
        }),

        method,

        resolveWithFullResponse: true,
        // Note: This setting sets the res.elapsedTime property in request
        time: true
      })
      .then(
        res => {
          const serializedHttpClientResponse = httpResponseSerializer(res);

          try {
            assert.strictEqual(serializedHttpClientResponse.status, statusCode);

            assert.strictEqual(serializedHttpClientResponse.time > 0, true);
            assert.strictEqual(serializedHttpClientResponse.time < 1000, true);

            assert.strictEqual(serializedHttpClientResponse.headers[includedHeaderKey], includedHeaderValue);
            assert.strictEqual(excludedHeaderKey in serializedHttpClientResponse.headers, false);
          } catch (err) {
            return callback(err);
          }

          callback(null);
        }
      )
      .catch(err => callback(err));
    });
  });
});
