'use strict';

const extend = require('extend');
const genericMappings = require('../generic').mappings;

const contextMappings = extend(
  true,
  genericMappings,
  {
    type: 'object',
    dynamic: true,

    properties: {}
  }
);

module.exports = contextMappings;
