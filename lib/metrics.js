var throttle = require('lodash.throttle');
var extend = require('extend');

function metrics (logger, options) {
  options = extend({
    throttle: 15000,
    event: 'app-metric'
  }, options);

  var cache = {};

  var flushLogs = throttle(function flushLogs () {
    Object.keys(cache).forEach(function (id) {
      logger.info(extend({
        event: options.event,
        metric: id
      }, cache[id]));
    });
    cache = {};
  }, options.throttle);

  function record (id, value) {
    if (!cache[id]) {
      cache[id] = {
        value: value,
        samples: 1,
        min: value,
        max: value
      };
    } else {
      var metric = cache[id];
      cache[id] = {
        value: (metric.value * metric.samples + value) / (metric.samples + 1),
        samples: metric.samples + 1,
        min: Math.min(metric.min, value),
        max: Math.max(metric.max, value)
      };
    }
    flushLogs();
  }

  function measure (id, fn) {
    return function () {
      var start = Date.now();
      return fn.apply(this, arguments)
        .then(function (result) {
          record(id, Date.now() - start);
          return result;
        }, function (err) {
          record(id, Date.now() - start);
          throw err;
        });
    };
  }

  return {
    record: record,
    measure: measure
  };
}

module.exports = metrics;
