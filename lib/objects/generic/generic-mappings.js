'use strict';

const genericMappings = {
  type: 'object',
  dynamic: false,

  properties: {
    hasSerializationError: {
      type: 'boolean'
    },
    serializationError: {
      type: 'object'
    },

    hasValidationErrors: {
      type: 'boolean'
    },
    validationErrors: {
      type: 'nested'
    }
  }
};

module.exports = genericMappings;
