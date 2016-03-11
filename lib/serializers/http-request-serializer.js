'use strict';

function httpRequestSerializer (req) {
  if (!req || !req.connection) {
    return req;
  }

  return {
    url: req.originalUrl || req.url,

    method: req.method,

    headers: req.headers,

    transaction: req.transaction,

    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort
  };
}

module.exports = httpRequestSerializer;
