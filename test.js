'use strict';

const Ajv = require('ajv');
const ajv = new Ajv({});

const schema = {
  properties: {
    isInternal: {
      type: 'string',
      format: 'ip'
    }
  }
};
const data = {
  isInternal: true
};

const validate = ajv.compile(schema);
const valid = validate(data);

if (!valid) {
  console.log(validate.errors);
}
