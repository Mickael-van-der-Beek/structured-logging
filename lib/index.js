'use strict';

var responseTime = require('response-time');
var uuid = require('uuid');

var httpRequestSerializer = require('./serializers/http-request-serializer');
var httpResponseSerializer = require('./serializers/http-response-serializer');
var errorSerializer = require('./serializers/error-serializer');

module.exports = {
  serializers: {
    req: httpRequestSerializer,
    res: httpResponseSerializer,
    err: errorSerializer
  },
  middleware: function (logger, options) {
    return function (req, res, next) {
      if ('logger' in req) {
        return next(null);
      }

      var requestLogger = logger.child({
        reqId: uuid.v4()
      });

      req.logger = requestLogger;

      responseTime(function (req, res, time) {
        /**
         * Here `req.logger` can't be called directly because if it's value is
         * overwritten, only the last logger will be called and it will be
         * called as many times as there were overrides.
         */

        requestLogger.info({
          event: options.event || 'app-request',
          req: req,
          res: res,
          responseTime: time
        });
      })(req, res, next);
    };
  },
  metrics: require('./metrics')
};
