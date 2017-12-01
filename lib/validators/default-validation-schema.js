'use strict';

const defaultValidationSchema = {
  optional: true,
  type: ['object', 'null'],

  properties: {
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L373
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L521
    hostname: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L524
    pid: {
      optional: true,
      type: 'integer',
      minimum: 0,
      maximum: 4294967295
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L974
    level: {
      optional: true,
      type: 'integer',
      minimum: 0
    },

    // ref: WooRank convention. Should be a static string.
    event: {
      type: 'string',
      minLength: 1,
      maxLength: 2047
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L984
    msg: {
      type: 'string',
      // Note: Bunyan doesn't use null and default to an empty string "" when no message is provided
      minLength: 0,
      maxLength: 2047
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L986
    time: {
      type: 'string',
      format: 'date-time'
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L992
    v: {
      type: 'integer'
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L990
    src: {
      optional: true,
      type: 'object',

      properties: {
        // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L195
        file: {
          type: 'string',
          minLength: 1,
          maxLength: 2047
        },
        // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L196
        line: {
          type: 'integer',
          minimum: 1
        },
        // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L199
        func: {
          optional: true,
          type: 'string',
          minLength: 1,
          maxLength: 2047
        }
      }
    }
  }
};

module.exports = defaultValidationSchema;
