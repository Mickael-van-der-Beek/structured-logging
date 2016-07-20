'use strict';

const middlewares = require('./middlewares');
const serializers = require('./serializers');

module.exports = {
  serializers: serializers,

  middlewares: middlewares
};
