/* global describe, it, afterEach */

'use strict';

var validator = require('validator');
var supertest = require('supertest');
var express = require('express');
var assert = require('chai').assert;
var bunyan = require('bunyan');
var pgk = require('../package');

var structuredLogging = require('../lib/index');

describe('HTTP Response serializer', function () {
  var server = null;

  afterEach('close HTTP server', function (done) {
    server.close(done);
  });

  it('serializes response correctly', function (done) {
    var testHeaderValue = 'This is a test messgage';
    var testHeaderKey = 'X-Test'.toLowerCase();
    var statusCode = 204;
    var startTime = null;
    var eventName = 'test-event';
    var diffTime = null;
    var hostname = '::ffff:127.0.0.1';
    var pathname = '/';
    var method = 'get';
    var port = 10000;

    var validateResponseLog = function (log) {
      log = JSON.parse(log);

      assert.isObject(log);
      assert.isObject(log.res);
      // assert.isObject(log.res.header);

      assert.equal(validator.isUUID(log.reqId, 4), true);

      assert.equal(log.event, eventName);

      assert.equal(log.res.statusCode, statusCode);

      // assert.equal(log.res.header[testHeaderKey], testHeaderValue);

      var responseTime = diffTime[0] * 1e3 + diffTime[1] * 1e-6;
      assert.closeTo(log.responseTime, responseTime, responseTime * 2);

      done();
    };

    var app = express();

    var logger = bunyan.createLogger({
      name: pgk.name,
      serializers: structuredLogging.serializers,
      stream: {
        write: validateResponseLog
      }
    });

    app.use(function (req, res, next) {
      startTime = process.hrtime();

      next();
    });

    app.use(
      structuredLogging.middleware(
        logger,
        {
          event: eventName
        }
      )
    );

    app[method](pathname, function (req, res) {
      diffTime = process.hrtime(startTime);

      res
        .set(testHeaderKey, testHeaderValue)
        .status(statusCode)
        .end();
    });

    server = app.listen(port, hostname, function (err) {
      if (err) {
        return done(err);
      }

      supertest(app)[method](pathname)
        .end(function (err, res) {
          if (err) {
            return done(err);
          }
        });
    });
  });
});
