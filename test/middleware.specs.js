/* global describe, it, afterEach */

'use strict';

var supertest = require('supertest');
var express = require('express');
var bunyan = require('bunyan');
var pgk = require('../package');

var structuredLogging = require('../lib/index');

describe('Express middleware', function () {
  var server = null;

  afterEach('close HTTP server', function (done) {
    server.close(done);
  });

  it('don\'t override `req.logger` if one already exists', function (done) {
    var hostname = '127.0.0.1';
    var pathname = '/';
    var method = 'get';
    var port = 10000;

    var app = express();

    var logger1 = bunyan.createLogger({
      name: pgk.name,
      serializers: structuredLogging.serializers,
      stream: {
        write: function () {
          done(null);
        }
      }
    });

    app.use(
      structuredLogging.middleware(
        logger1,
        {}
      )
    );

    var logger2 = bunyan.createLogger({
      name: pgk.name,
      serializers: structuredLogging.serializers,
      stream: {
        write: function () {
          done(new Error('Previous `req.logger was overwritten'));
        }
      }
    });

    app.use(
      structuredLogging.middleware(
        logger2,
        {}
      )
    );

    app[method](pathname, function (req, res) {
      res
        .status(200)
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
