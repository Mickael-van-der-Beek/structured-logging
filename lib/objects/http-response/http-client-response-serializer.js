'use strict';

const httpClientResponseSerializer = function httpClientResponseSerializer (res) {
  if (!res) {
    return null;
  }

  const time = res.elapsedTime || null;

  const headers = res._headers || null;

  return {
    origin: 'client',

    status: res.statusCode,

    time,

    headers
  };
};

module.exports = httpClientResponseSerializer;
