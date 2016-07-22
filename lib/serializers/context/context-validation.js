'use strict';

const AJV = require('ajv');

const contextValidation = new AJV({
  v5: true,
  format: 'fast',
  verbose: true,
  removeAdditional: false
})
  .compile({
    optional: true,
    type: ['object', 'null']
  });

module.exports = contextValidation;
