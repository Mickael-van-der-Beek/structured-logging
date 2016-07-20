'use strict';

const extend = require('extend');
const responseTime = require('response-time');
const uuid = require('uuid');

function serverMiddleware (logger, options) {
  if (!logger) {
    throw new Error('missing parameter: logger');
  }

  options = extend({
    event: 'app-request'
  }, options);

  return function (req, res, next) {
    if ('logger' in req) {
      return next(null);
    }

    const requestLogger = logger.child({
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
        event: options.event,
        req,
        res,
        responseTime: time
      });
    })(req, res, next);
  };
}

module.exports = serverMiddleware;
