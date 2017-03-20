'use strict';

const errMappingSchema = {
  type: 'object',
  dynamic: false,

  properties: {
    message: {
      type: 'keyword'
    },
    name: {
      type: 'keyword'
    },
    stack: {
      type: 'text',
      analyzer: 'stack_analyzer',
      fielddata: true
    },

    code: {
      type: 'keyword'
    },
    signal: {
      type: 'keyword'
    }
  }
};

module.exports = errMappingSchema;
