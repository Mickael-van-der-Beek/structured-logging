'use strict';

const responseTime = require('response-time');
const uuid = require('uuid');

const ServerMiddleware = function ServerMiddleware (logger, options) {
  if (!logger) {
    throw new Error('missing parameter: logger');
  }

  options = Object.assign({
    event: 'server-request'
  }, options);

  return (req, res, next) => {
    if ('logger' in req) {
      return next(null);
    }

    const requestLogger = logger.child({
      reqId: uuid.v4()
    });

    req.logger = requestLogger;

    responseTime((req, res, time) => {
      /**
       * Here `req.logger` can't be called directly because if it's value is
       * overwritten, only the last logger will be called and it will be
       * called as many times as there were overrides.
       */

      requestLogger.info({
        event: options.event,
        req,
        res,
        resTime: time,
        ...(
          typeof options.setContext === 'function'
            ? options.setContext(req, res, time) || {}
            : {}
        )
      });
    })(req, res, next);
  };
};

module.exports = ServerMiddleware;
