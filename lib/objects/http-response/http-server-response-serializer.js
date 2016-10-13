'use strict';

const httpServerResponseSerializer = function httpServerResponseSerializer (res) {
  if (!res) {
    return null;
  }

  const time = res.responseTime || null;

  const headers = res._headers || null;

  return {
    origin: 'server',

    status: res.statusCode,

    time,

    headers
  };
};

module.exports = httpServerResponseSerializer;
