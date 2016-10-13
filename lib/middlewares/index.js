'use strict';

const serverMiddleware = require('./server-middleware');
const clientMiddleware = require('./client-middleware');

module.exports = {
  server: serverMiddleware,

  client: clientMiddleware
};
