'use strict';

const httpResponseSerializer = require('./http-response/http-response-serializer');
const httpRequestSerializer = require('./http-request/http-request-serializer');
const contextSerializer = require('./context/context-serializer');
const errorSerializer = require('./error/error-serializer');

module.exports = {
  request: httpRequestSerializer,
  req: httpRequestSerializer,

  response: httpResponseSerializer,
  res: httpResponseSerializer,

  e: errorSerializer,
  err: errorSerializer,
  error: errorSerializer,

  context: contextSerializer
};
