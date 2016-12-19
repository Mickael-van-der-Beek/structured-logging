'use strict';

const genericValidator = {
  type: ['object', 'null'],

  properties: {
    hasSerializationError: {
      type: 'boolean'
    },
    serializationError: {
      type: 'object',
      additionalProperties: true
    },

    hasValidationErrors: {
      type: 'boolean'
    },
    validationErrors: {
      type: 'array',
      additionalItems: true
    }
  }
};

module.exports = genericValidator;
