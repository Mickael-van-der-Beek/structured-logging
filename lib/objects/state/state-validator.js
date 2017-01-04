'use strict';

const AJV = require('ajv');
const extend = require('extend');
const genericValidator = require('../generic').validator;

const stateValidator = new AJV({
  v5: true,
  format: 'fast',
  verbose: true,
  allErrors: true,
  removeAdditional: false
})
  .compile(
    extend(
      true,
      {
        type: ['object', 'null']
      },
      genericValidator
    )
  );

module.exports = stateValidator;
