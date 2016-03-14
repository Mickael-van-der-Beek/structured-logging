'use strict';

function httpResponseSerializer (res) {
  if (!res || !res.statusCode) {
    return res;
  }

  return {
    statusCode: res.statusCode,

    header: (
      res.header ||
      res._header ||
      res.headers ||
      undefined
    )
  };
}

module.exports = httpResponseSerializer;
