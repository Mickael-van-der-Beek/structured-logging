'use strict';

const reqValidationSchema = {
  optional: true,
  type: ['object', 'null'],

  properties: {
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1094
    method: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1095
    url: {
      type: 'string',
      format: 'uri',
      minLength: 1,
      maxLength: 65535
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1096
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
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1097
    remoteAddress: {
      type: 'string',
      minLength: 1,
      maxLength: 39,
      anyOf: [{
        format: 'ipv4'
      }, {
        format: 'ipv6'
      }]
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1098
    remotePort: {
      type: 'integer',
      minimum: 0,
      maximum: 65535
    }
  }
};

module.exports = reqValidationSchema;
