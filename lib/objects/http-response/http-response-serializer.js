'use strict';

const genericSerializer = require('../generic').serializer;
// const http = require('http');
const httpClientResponseSerializer = require('./http-client-response-serializer');
const httpResponseValidator = require('./http-response-validator');
const httpServerResponseSerializer = require('./http-server-response-serializer');

const httpResponseSerializer = function httpResponseSerializer (res) {
  let serializer = null;

  // Note: Choose the server or the client response serializer based on feature detection
  // if (res instanceof http.OutgoingMessage) {
  if (res && res.elapsedTime) {
    serializer = httpClientResponseSerializer;
  } else {
    serializer = httpServerResponseSerializer;
  }

  return genericSerializer(
    serializer,
    httpResponseValidator,
    res
  );
};

module.exports = httpResponseSerializer;
