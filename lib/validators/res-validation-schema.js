'use strict';

const resValidationSchema = {
  optional: true,
  type: ['object', 'null'],

  properties: {
    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1112
    statusCode: {
      type: 'integer',
      minimum: 1,
      maximum: 999
    },

    // ref: https://github.com/trentm/node-bunyan/blob/f4fff7b7facf8ad800f5c430608c1e2e3c746495/lib/bunyan.js#L1113
    header: {
      type: 'object',
      properties: {
        server: {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        p3p: {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 2047
        },

        'accept-ranges': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        vary: {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },

        'www-authenticate': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },

        'content-base': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 2047
        },
        'content-encoding': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        'content-language': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 2047
        },
        'content-length': {
          optional: true,
          type: 'integer'
        },
        'content-md5': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 32
        },
        'content-range': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        'content-type': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },

        etag: {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        expires: {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        'last-modified': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },

        location: {
          optional: true,
          type: 'string',
          minLength: 1,
          maxLength: 2047
        },

        'x-frame-options': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        'x-xss-protection': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        },
        'x-content-security-policy': {
          optional: true,
          type: 'string',
          minlength: 1,
          maxLength: 255
        }
      }
    }
  }
};

module.exports = resValidationSchema;
