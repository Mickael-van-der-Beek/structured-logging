'use strict';

const AJV = require('ajv');
const extend = require('extend');
const genericValidator = require('../generic').validator;

const errorValidator = new AJV({
  v5: true,
  format: 'fast',
  verbose: true,
  allErrors: true,
  coerceTypes: true,
  removeAdditional: 'all'
})
  .compile(
    extend(
      true,
      genericValidator,
      {
        type: ['object', 'null'],

        properties: {
          name: {
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          message: {
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },
          stack: {
            type: 'string',
            minLength: 1,
            maxLength: 2047
          },

          code: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },
          signal: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 255
          },

          statusCode: {
            optional: true,
            type: 'integer',
            minimum: 1,
            maximum: 999
          },

          cause: {
            optional: true,
            type: 'string',
            minLength: 1,
            maxLength: 2047
          }
        }
      }
    )
  );

module.exports = errorValidator;
