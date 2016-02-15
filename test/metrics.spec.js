/* global describe, it, afterEach */

var bunyan = require('bunyan');
var structuredLogging = require('..');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('metrics', function () {
  var clock = null;
  var nowStub = null;

  afterEach(function () {
    if (clock) {
      clock.restore();
      clock = null;
    }
    if (nowStub) {
      nowStub.restore();
      nowStub = null;
    }
  });

  describe('record', function () {
    it('should record a value', function (done) {
      var logger = bunyan.createLogger({
        name: 'metrics-test',
        stream: {
          write: function (line) {
            var log = JSON.parse(line);
            assert.propertyVal(log, 'event', 'app-metric');
            assert.propertyVal(log, 'metric', 'testMetric');
            assert.propertyVal(log, 'value', 5);
            assert.propertyVal(log, 'samples', 1);
            assert.propertyVal(log, 'min', 5);
            assert.propertyVal(log, 'max', 5);
            done();
          }
        }
      });
      structuredLogging.metrics(logger).record('testMetric', 5);
    });

    it('should allow custom event names', function (done) {
      var logger = bunyan.createLogger({
        name: 'metrics-test',
        stream: {
          write: function (line) {
            var log = JSON.parse(line);
            assert.propertyVal(log, 'event', 'custom-event');
            done();
          }
        }
      });
      structuredLogging.metrics(logger, {
        event: 'custom-event'
      }).record('testMetric', 5);
    });

    it('should throttle multiple calls', function () {
      clock = sinon.useFakeTimers();
      var info = sinon.stub();
      var logger = { info: info };
      var metrics = structuredLogging.metrics(logger, { throttle: 5000 });
      metrics.record('aMetric', 5);
      clock.tick(1);
      metrics.record('aMetric', 6);
      clock.tick(1);
      metrics.record('aMetric', 7);
      clock.tick(1);
      metrics.record('aMetric', 11);
      clock.tick(4995);
      assert.strictEqual(info.callCount, 1);
      var log = info.firstCall.args[0];
      assert.propertyVal(log, 'metric', 'aMetric');
      assert.propertyVal(log, 'value', 5);
      assert.propertyVal(log, 'samples', 1);
      clock.tick(2);
      assert.strictEqual(info.callCount, 2);
      log = info.secondCall.args[0];
      assert.propertyVal(log, 'metric', 'aMetric');
      assert.propertyVal(log, 'value', 8);
      assert.propertyVal(log, 'samples', 3);
      assert.propertyVal(log, 'min', 6);
      assert.propertyVal(log, 'max', 11);
    });
  });

  describe('measure', function () {
    it('should measure execution time of promises', function () {
      var info = sinon.stub();
      var metrics = structuredLogging.metrics({ info: info });
      var self = {};
      nowStub = sinon.stub(Date, 'now').returns(1000);
      var instrumentedFn = metrics.measure('timedFn', function (arg1, arg2) {
        assert.strictEqual(this, self);
        assert.strictEqual(arg1, 1);
        assert.strictEqual(arg2, 2);
        nowStub.returns(2500);
        return Promise.resolve('result');
      });
      return instrumentedFn.call(self, 1, 2)
        .then(function (result) {
          assert.strictEqual(result, 'result');
          assert.strictEqual(info.callCount, 1);
          var log = info.firstCall.args[0];
          assert.propertyVal(log, 'metric', 'timedFn');
          assert.propertyVal(log, 'value', 1500);
        });
    });

    it('should log on rejection', function () {
      var info = sinon.stub();
      var metrics = structuredLogging.metrics({ info: info });
      nowStub = sinon.stub(Date, 'now').returns(1000);
      var thrownError = new Error('rejected!');
      var instrumentedFn = metrics.measure('timedFn', function (arg1, arg2) {
        nowStub.returns(2300);
        return Promise.reject(thrownError);
      });
      return instrumentedFn()
        .then(function () {
          assert.fail();
        }, function (err) {
          assert.strictEqual(err, thrownError);
          assert.strictEqual(info.callCount, 1);
          var log = info.firstCall.args[0];
          assert.propertyVal(log, 'metric', 'timedFn');
          assert.propertyVal(log, 'value', 1300);
        });
    });
  });
});
