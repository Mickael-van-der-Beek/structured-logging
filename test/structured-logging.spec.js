/* global describe, it */

'use strict';

var assert = require('chai').assert;

var structuredLogging = require('../lib/index');

describe('Structured Logging module', function () {
  it('has serializers', function () {
    assert.isObject(structuredLogging.serializers);
    assert.isAbove(Object.keys(structuredLogging.serializers).length, 0);
  });

  it('has middleware', function () {
    assert.isFunction(structuredLogging.middleware);
  });

  it('middleware accepts logger and options arguments', function () {
    assert.equal(structuredLogging.middleware.length, 2);
  });
});
