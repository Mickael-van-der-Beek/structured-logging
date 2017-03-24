'use strict';

const bunyan = require('bunyan');

const reqSerializer = req => {
  const serializedReq = bunyan.stdSerializers.req(req);

  // Fixes Bunyan bug while waiting for merge of: https://github.com/trentm/node-bunyan/pull/278
  if (req.originalUrl) {
    serializedReq.url = req.originalUrl;
  }

  return serializedReq;
};

module.exports = reqSerializer;
