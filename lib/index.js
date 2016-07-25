'use strict';

const mappingsManagers = require('./mappings-managers');
const middlewares = require('./middlewares');
const objects = require('./objects');
const serializers = require('./serializers');

module.exports = {
  mappingsManagers,

  objects,

  serializers,

  middlewares
};
