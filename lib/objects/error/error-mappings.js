'use strict';

const extend = require('extend');
const genericMappings = require('../generic').mappings;

const errorMappings = extend(
  true,
  {
    type: 'object',
    dynamic: false,

    properties: {
      name: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 255,
        include_in_all: true
      },
      message: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 255,
        include_in_all: true
      },
      stack: {
        type: 'string',
        ignore_above: 2047,
        include_in_all: false
      },

      code: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 255,
        include_in_all: true
      },
      signal: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 255,
        include_in_all: true
      },

      statusCode: {
        type: 'short',
        coerce: false,
        ignore_malformed: true
      },

      cause: {
        type: 'string',
        ignore_above: 2047,
        include_in_all: false
      }
    }
  },
  genericMappings
);

module.exports = errorMappings;
