'use strict';

const AJV = require('ajv');

const defaultValidationSchema = require('./default-validation-schema');
const errValidationSchema = require('./err-validation-schema');
const reqValidationSchema = require('./req-validation-schema');
const resValidationSchema = require('./res-validation-schema');

const schema = defaultValidationSchema;
schema.properties = Object.assign(
  {},
  schema.properties,
  {
    err: errValidationSchema,
    req: reqValidationSchema,
    res: resValidationSchema
  }
);

const validator = new AJV({
  v5: true,
  format: 'fast',
  verbose: false,
  allErrors: true,
  coerceTypes: true,
  removeAdditional: 'all'
}).compile(schema);

module.exports = {
  validator,
  schema: schema.properties
};
