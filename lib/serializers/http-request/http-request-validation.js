'use strict';

const AJV = require('ajv');

const httpRequestValidation = new AJV({
  v5: true,
  format: 'fast',
  verbose: true,
  coerceTypes: true,
  removeAdditional: 'all'
})
  .compile({
    optional: true,
    type: ['object', 'null'],

    properties: {
      isInternal: {
        type: 'boolean'
      },

      httpVersionMajor: {
        type: 'integer',
        minimum: 1,
        maximum: 9
      },
      httpVersionMinor: {
        type: 'integer',
        minimum: 1,
        maximum: 9
      },

      method: {
        type: 'string',
        minLength: 1,
        maxLength: 255
      },

      remoteAddresses: {
        type: 'array',
        minItems: 1,
        uniqueItems: true,
        items: {
          type: 'string',
          minLength: 1,
          maxLength: 39,
          anyOf: [{
            format: 'ipv4'
          }, {
            format: 'ipv6'
          }]
        }
      },
      remoteFamily: {
        type: 'string',
        enum: [
          'IPv4',
          'IPv6'
        ]
      },
      remotePort: {
        type: 'integer',
        format: 'int16'
        // minimum: 0,
        // maximum: 65535
      },

      uri: {
        type: 'object',
        properties: {
          protocol: {
            type: 'string',
            enum: [
              'https:',
              'http:'
            ]
          },
          hostname: {
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          port: {
            optional: true,
            type: 'integer',
            format: 'int16'
            // minimum: 0,
            // maximum: 65535
          },
          pathname: {
            type: 'string',
            minLength: 1,
            maxLength: 1790
          },
          query: {
            optional: true,
            type: ['string', 'null'],
            minLength: 1,
            maxLength: 1789
          },
          hash: {
            optional: true,
            type: ['string', 'null'],
            minLength: 1,
            maxLength: 1789
          }
        }
      },

      headers: {
        type: 'object',
        properties: {
          connection: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          'proxy-connection': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          host: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 261
          },

          origin: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          referer: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },

          upgrade: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          accept: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          'accept-charset': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          'accept-encoding': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          'accept-language': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          'transfer-encoding': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          te: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          'x-requested-with': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },
          via: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },
          'x-forwarded-for': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },
          'x-forwarded-host': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 261
          },
          'x-forwarded-proto': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          'x-http-method-override': {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          dnt: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          }
        }
      }
    }
  });

module.exports = httpRequestValidation;
