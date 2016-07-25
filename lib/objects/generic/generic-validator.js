'use strict';

const genericValidator = {
  type: ['object', 'null'],

  properties: {
    hasSerializationError: {
      type: 'boolean'
    },
    serializationError: {
      type: ['object', 'null'],
      additionalProperties: true
    },

    hasValidationErrors: {
      type: 'boolean'
    },
    validationErrors: {
      type: ['array', 'null'],
      additionalItems: true
    }
  }
};

module.exports = genericValidator;
