'use strict';

const reqMappingSchema = {
  type: 'object',
  dynamic: false,

  properties: {
    method: {
      type: 'keyword'
    },

    url: {
      type: 'text',
      index: 'not_analyzed',
      fields: {
        path: {
          type: 'text',
          analyzer: 'path_analyzer',
          search_analyzer: 'keyword'
        },
        query: {
          type: 'text',
          analyzer: 'query_analyzer',
          search_analyzer: 'keyword'
        }
      }
    },

    headers: {
      type: 'object',
      dynamic: false,

      properties: {
        connection: {
          type: 'keyword'
        },
        'proxy-connection': {
          type: 'keyword'
        },
        host: {
          type: 'keyword'
        },

        origin: {
          type: 'keyword'
        },
        referer: {
          type: 'keyword'
        },

        upgrade: {
          type: 'keyword'
        },

        accept: {
          type: 'keyword'
        },
        'accept-charset': {
          type: 'keyword'
        },
        'accept-encoding': {
          type: 'keyword'
        },
        'accept-language': {
          type: 'keyword'
        },

        'transfer-encoding': {
          type: 'keyword'
        },
        te: {
          type: 'keyword'
        },

        'x-requested-with': {
          type: 'keyword'
        },
        via: {
          type: 'keyword'
        },
        'x-forwarded-for': {
          type: 'keyword'
        },
        'x-forwarded-host': {
          type: 'keyword'
        },
        'x-forwarded-proto': {
          type: 'keyword'
        },

        'x-http-method-override': {
          type: 'keyword'
        },

        dnt: {
          type: 'keyword'
        }
      }
    },

    remoteAddress: {
      type: 'ip'
    },
    remotePort: {
      type: 'integer'
    }
  }
};

module.exports = reqMappingSchema;
