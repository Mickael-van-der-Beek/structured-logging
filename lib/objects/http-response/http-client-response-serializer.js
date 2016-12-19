'use strict';

const httpClientResponseSerializer = function httpClientResponseSerializer (res) {
  if (!res) {
    return null;
  }

  return {
    origin: 'client',

    status: res.statusCode,

    time: res.elapsedTime || null,

    headers: Object.assign({}, res.headers)
  };
};

module.exports = httpClientResponseSerializer;
