/* eslint-env mocha */

'use strict';

const assert = require('assert');
const bunyan = require('bunyan');
const express = require('express');
const supertest = require('supertest');
const querystring = require('querystring');

const ServerMiddleware = require('../../lib/middlewares/server-middleware');

const reqSerializer = require('../../lib/serializers/req-serializer');
const resSerializer = require('../../lib/serializers/res-serializer');

describe('ServerMiddleware', () => {
  let server = null;

  afterEach('close HTTP server', callback => {
    if (server === null) {
      return callback();
    }

    server.close(callback);
  });
  it('req', callback => {
    const headerKey = 'referer';
    const headerValue = 'http://example.com';
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const method = 'GET';
    const query = {
      key: 'value'
    };
    const port = 10000;

    const logger = bunyan.createLogger({
      name: 'structured-logging',
      serializers: {
        req: reqSerializer
      },
      streams: [{
        type: 'raw',
        stream: {
          write: log => {
            try {
              assert.ok(/^([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})$/.test(log.reqId));

              assert.strictEqual(log.req.method, method);

              assert.strictEqual(log.req.url, `${pathname}?${querystring.stringify(query)}`);

              assert.strictEqual(log.req.headers.host, `[${hostname}]:${port}`);
              assert.strictEqual(log.req.headers[headerKey], headerValue);

              assert.strictEqual(log.req.remoteAddress, '::ffff:127.0.0.1');

              assert.strictEqual(typeof log.req.remotePort, 'number');
              assert.strictEqual(log.req.remotePort > 0, true);
              assert.strictEqual(log.req.remotePort < Math.pow(2, 16), true);
            } catch (err) {
              return callback(err);
            }

            callback(null);
          }
        }
      }]
    });

    const app = express();

    app.use(ServerMiddleware(logger, {}));

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
  it('res', callback => {
    const headerKey = 'server';
    const headerValue = 'http://example.com';
    const statusCode = 418;
    const hostname = '::ffff:127.0.0.1';
    const pathname = '/pathname';
    const method = 'GET';
    const port = 10000;

    const logger = bunyan.createLogger({
      name: 'structured-logging',
      serializers: {
        res: resSerializer
      },
      streams: [{
        type: 'raw',
        stream: {
          write: log => {
            try {
              assert.ok(log.resTime > 0);
              assert.ok(log.resTime < 1000);

              assert.strictEqual(log.res.statusCode, statusCode);

              assert.strictEqual(log.res.header[headerKey], headerValue);
            } catch (err) {
              return callback(err);
            }

            callback(null);
          }
        }
      }]
    });

    const app = express();

    app.use(ServerMiddleware(logger, {}));

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
