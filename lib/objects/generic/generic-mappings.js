'use strict';

const genericMappings = {
  type: 'object',
  dynamic: false,

  properties: {
    hasSerializationError: {
      type: 'boolean'
    },
    serializationError: {
      type: 'object',
      dynamic: true
    },

    hasValidationErrors: {
      type: 'boolean'
    },
    validationErrors: {
      type: 'nested',
      dynamic: true
    }
  }
};

module.exports = genericMappings;
