'use strict';

module.exports = function httpRequestSerializer (req) {
  if (!req || !req.connection) {
    return req;
  }

  return {
    url: req.url,

    method: req.method,

    headers: req.headers,

    remoteAddress: req.connection.remoteAddress,
    remotePort: req.connection.remotePort
  };
};
