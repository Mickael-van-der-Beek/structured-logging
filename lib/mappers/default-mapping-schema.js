'use strict';

const defaultValidationSchema = {
  type: 'object',
  dynamic: false,

  properties: {
    name: {
      type: 'keyword'
    },
    hostname: {
      type: 'keyword'
    },

    pid: {
      type: 'integer'
    },

    level: {
      type: 'integer'
    },

    event: {
      type: 'keyword'
    },
    msg: {
      type: 'keyword'
    },

    time: {
      type: 'date'
    },

    v: {
      type: 'integer'
    },

    src: {
      type: 'object',
      dynamic: false,

      properties: {
        file: {
          type: 'keyword'
        },
        line: {
          type: 'integer'
        },
        func: {
          type: 'keyword'
        }
      }
    }
  }
};

module.exports = defaultValidationSchema;
