'use strict';

const extend = require('extend');
const genericMappings = require('../generic').mappings;

const httpResponseMappings = extend(
  true,
  {
    type: 'object',
    dynamic: false,

    properties: {
      origin: {
        type: 'string',
        ignore_above: 255,
        include_in_all: false
      },

      status: {
        type: 'short',
        coerce: false,
        ignore_malformed: true
      },

      time: {
        type: 'float',
        coerce: false,
        ignore_malformed: true
      },

      headers: {
        dynamic: false,
        properties: {
          server: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          p3p: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },

          'accept-ranges': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          vary: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          'www-authenticate': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          'content-base': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },
          'content-encoding': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'content-language': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },
          'content-length': {
            type: 'integer',
            coerce: false,
            ignore_malformed: true
          },
          'content-md5': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 32,
            include_in_all: false
          },
          'content-range': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'content-type': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          etag: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          expires: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'last-modified': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          location: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },

          'x-frame-options': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'x-xss-protection': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'x-content-security-policy': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          }
        }
      }
    }
  },
  genericMappings
);

module.exports = httpResponseMappings;
