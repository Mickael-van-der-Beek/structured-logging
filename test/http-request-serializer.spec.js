/* global describe, it, afterEach */

'use strict';

var supertest = require('supertest');
var express = require('express');
var assert = require('chai').assert;
var bunyan = require('bunyan');
var pgk = require('../package');
var ip = require('ip');

var structuredLogging = require('../lib/index');

describe('HTTP Request serializer', function () {
  var server = null;

  afterEach('close HTTP server', function (done) {
    server.close(done);
  });

  it('serializes request correctly', function (done) {
    var testHeaderValue = 'This is a test messgage';
    var testHeaderKey = 'X-Test'.toLowerCase();
    var statusCode = 204;
    var hostname = '127.0.0.1';
    var pathname = '/';
    var method = 'get';
    var port = 10000;

    var validateRequestLog = function (log) {
      log = JSON.parse(log);

      assert.isObject(log);
      assert.isObject(log.req);
      assert.isObject(log.req.headers);

      assert.equal(log.req.url, pathname);

      assert.equal(log.req.method, method.toUpperCase());

      assert.equal(log.req.headers.host, hostname + ':' + port);
      assert.equal(log.req.headers[testHeaderKey], testHeaderValue);

      assert.equal(ip.isLoopback(log.req.remoteAddress), true);

      assert.isNumber(log.req.remotePort);
      assert.notEqual(log.req.remotePort, port);
      assert.isAbove(log.req.remotePort, 0);
      assert.isBelow(log.req.remotePort, Math.pow(2, 16) - 1);

      done();
    };

    var app = express();

    var logger = bunyan.createLogger({
      name: pgk.name,
      serializers: structuredLogging.serializers,
      stream: {
        write: validateRequestLog
      }
    });

    app.use(
      structuredLogging.middleware(
        logger,
        {}
      )
    );

    app[method](pathname, function (req, res) {
      res
        .status(statusCode)
        .end();
    });

    server = app.listen(port, hostname, function (err) {
      if (err) {
        return done(err);
      }

      supertest(app)[method](pathname)
        .set('Host', hostname + ':' + port)
        .set(testHeaderKey, testHeaderValue)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
        });
    });
  });
});
