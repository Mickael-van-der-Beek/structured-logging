'use strict';

const genericSerializer = require('../generic').serializer;
const httpClientRequestSerializer = require('./http-client-request-serializer');
const httpRequestValidator = require('./http-request-validator');
const httpServerRequestSerializer = require('./http-server-request-serializer');

const httpRequestSerializer = function httpRequestSerializer (req) {
  let serializer = null;

  // Note: Choose the server or the client request serializer based on feature detection
  if (req && !req.ip && !req.ips) {
    serializer = httpClientRequestSerializer;
  } else {
    serializer = httpServerRequestSerializer;
  }

  return genericSerializer(
    serializer,
    httpRequestValidator,
    req
  );
};

module.exports = httpRequestSerializer;
