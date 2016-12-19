'use strict';

const httpServerResponseSerializer = function httpServerResponseSerializer (res) {
  if (!res) {
    return null;
  }

  return {
    origin: 'server',

    status: res.statusCode,

    time: res.responseTime || null,

    headers: Object.assign({}, res._headers)
  };
};

module.exports = httpServerResponseSerializer;
