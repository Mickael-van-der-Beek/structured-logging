'use strict';

const extend = require('extend');
const uuid = require('uuid');

const clientMiddleware = function clientMiddleware (logger, options) {
  if (!logger) {
    throw new Error('missing parameter: logger');
  }

  options = extend({
    event: 'client-request'
  }, options);

  return res => {
    const requestLogger = logger.child({
      reqId: uuid.v4()
    });

    const req = res.req;

    // Note: These are only the headers set by the user due to limitations in the request module
    req.headers = res.request.headers;
    req.uri = res.request.uri;

    requestLogger.info({
      event: options.event,
      req,
      res
    });

    return res;
  };
};

module.exports = clientMiddleware;
