'use strict';

const resMappingSchema = {
  type: 'object',
  dynamic: false,

  properties: {
    status: {
      type: 'short'
    },

    header: {
      type: 'object',
      dynamic: false,

      properties: {
        server: {
          type: 'keyword'
        },
        p3p: {
          type: 'keyword'
        },

        'accept-ranges': {
          type: 'keyword'
        },
        vary: {
          type: 'keyword'
        },

        'www-authenticate': {
          type: 'keyword'
        },

        'content-base': {
          type: 'keyword'
        },
        'content-encoding': {
          type: 'keyword'
        },
        'content-language': {
          type: 'keyword'
        },
        'content-length': {
          type: 'integer'
        },
        'content-md5': {
          type: 'keyword'
        },
        'content-range': {
          type: 'keyword'
        },
        'content-type': {
          type: 'keyword'
        },

        etag: {
          type: 'keyword'
        },
        expires: {
          type: 'keyword'
        },
        'last-modified': {
          type: 'keyword'
        },

        location: {
          type: 'keyword'
        },

        'x-frame-options': {
          type: 'keyword'
        },
        'x-xss-protection': {
          type: 'keyword'
        },
        'x-content-security-policy': {
          type: 'keyword'
        }
      }
    }
  }
};

module.exports = resMappingSchema;
