'use strict';

function httpResponseSerializer (res) {
  if (!res) {
    return null;
  }

  const time = res.responseTime || res.elapsedTime;

  return {
    status: res.statusCode,

    time: time,

    headers: res.headers
  };
}

module.exports = httpResponseSerializer;
