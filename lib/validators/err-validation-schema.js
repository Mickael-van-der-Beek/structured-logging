'use strict';

const errValidationSchema = {
  optional: true,
  type: ['object', 'null'],

  properties: {
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1145
    message: {
      type: 'string',
      minLength: 1,
      maxLength: 20470
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1146
    name: {
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1147
    stack: {
      type: 'string',
      minLength: 1,
      maxLength: 20470
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1148
    code: {
      optional: true,
      type: 'string',
      minLength: 1,
      maxLength: 255
    },
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1149
    signal: {
      optional: true,
      type: 'string',
      minLength: 1,
      maxLength: 255
    }
  }
};

module.exports = errValidationSchema;
