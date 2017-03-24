'use strict';

const bunyan = require('bunyan');

const resSerializer = res => {
  const serializedRes = bunyan.stdSerializers.res(res);

  // Fixes Bunyan bug while waiting for merge of: https://github.com/trentm/node-bunyan/pull/149
  if (!serializedRes.header && res._headers) {
    serializedRes.header = res._headers;
  }

  return serializedRes;
};

module.exports = resSerializer;
