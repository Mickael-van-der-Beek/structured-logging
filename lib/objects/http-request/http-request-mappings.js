'use strict';

const extend = require('extend');
const genericMappings = require('../generic').mappings;

const httpRequestMappings = extend(
  true,
  genericMappings,
  {
    type: 'object',
    dynamic: false,

    properties: {
      origin: {
        type: 'string',
        ignore_above: 255,
        include_in_all: false
      },

      isInternal: {
        type: 'boolean'
      },

      httpVersionMajor: {
        type: 'byte',
        coerce: false,
        ignore_malformed: true
      },
      httpVersionMinor: {
        type: 'byte',
        coerce: false,
        ignore_malformed: true
      },

      method: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 16,
        include_in_all: false
      },

      remoteAddresses: {
        type: 'ip'
      },
      remoteFamily: {
        type: 'string',
        index: 'not_analyzed',
        ignore_above: 4,
        include_in_all: false
      },
      remotePort: {
        type: 'integer',
        coerce: false,
        ignore_malformed: true
      },

      uri: {
        dynamic: false,
        properties: {
          protocol: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 5,
            include_in_all: false
          },
          hostname: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            fields: {
              tokenized: {
                type: 'string',
                ignore_above: 255,
                analyser: 'domain_analyser'
              }
            }
          },
          port: {
            type: 'integer',
            coerce: false,
            ignore_malformed: true
          },
          pathname: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 1790,
            fields: {
              tokenized: {
                type: 'string',
                ignore_above: 1790,
                analyser: 'path_analyser'
              }
            }
          },
          query: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 1789,
            fields: {
              tokenized: {
                type: 'string',
                ignore_above: 1789,
                analyser: 'query_analyser'
              }
            }
          },
          hash: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 1789,
            include_in_all: false
          }
        }
      },

      headers: {
        dynamic: false,
        properties: {
          connection: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'proxy-connection': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          host: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 261,
            include_in_all: false
          },

          origin: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          referer: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },

          upgrade: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          accept: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'accept-charset': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'accept-encoding': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          'accept-language': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          'transfer-encoding': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },
          te: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          'x-requested-with': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },
          via: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },
          'x-forwarded-for': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 2047,
            include_in_all: false
          },
          'x-forwarded-host': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 261,
            include_in_all: false
          },
          'x-forwarded-proto': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          'x-http-method-override': {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          },

          dnt: {
            type: 'string',
            index: 'not_analyzed',
            ignore_above: 255,
            include_in_all: false
          }
        }
      }
    }
  }
);

module.exports = httpRequestMappings;
