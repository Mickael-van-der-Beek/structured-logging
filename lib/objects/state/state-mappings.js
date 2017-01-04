'use strict';

const extend = require('extend');
const genericMappings = require('../generic').mappings;

const stateMappings = extend(
  true,
  {
    type: 'object',
    dynamic: true,

    properties: {}
  },
  genericMappings
);

module.exports = stateMappings;
