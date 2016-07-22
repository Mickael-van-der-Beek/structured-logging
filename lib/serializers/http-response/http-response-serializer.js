'use strict';

function httpResponseSerializer (res) {
  if (!res) {
    return null;
  }

  const time = res.responseTime || res.elapsedTime;

  const headers = (
    res.headers ||
    res._headers ||
    null
  );

  return {
    status: res.statusCode,

    time,

    headers
  };
}

module.exports = httpResponseSerializer;
