'use strict';

const httpResponseSerializer = require('./http-response/http-response-serializer');
const httpRequestSerializer = require('./http-request/http-request-serializer');
const contextSerializer = require('./context/context-serializer');
const errorSerializer = require('./error/error-serializer');

module.exports = {
  req: httpRequestSerializer,

  res: httpResponseSerializer,

  err: errorSerializer,

  context: contextSerializer
};
