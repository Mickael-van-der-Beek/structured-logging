'use strict';

const dot = require('dot-object');

const {
  schema,
  validator
} = require('../validators');

class PruneValidationStream {
  constructor () {
    this.stream = process.stdout;
  }

  // ref: https://cwiki.apache.org/confluence/display/solr/Defining+Fields#DefiningFields-FieldProperties
  sanitizeKey (name) {
    return name
      .replace(/-/g, '_')
      .replace(/[^a-zA-Z0-9_]/g, 'x')
      .replace(/^[0-9]/, 'x')
      .replace(/^__(.+)__$/, 'xx$1xx');
  }

  prune (schema, data) {
    const state = {};
    const keys = Object.keys(data);
    let len = keys.length;

    while (len--) {
      if (keys[len] in schema === false) {
        state[keys[len]] = data[keys[len]];
        delete data[keys[len]];
      }
    }

    return state;
  }

  validate (validator, data) {
    if (validator(data) !== true) {
      data.hasValidationErrors = true;
      data.validationErrors = validator.errors;

      data.validationErrors.forEach(validationError => {
        dot.del(validationError.dataPath.slice(1), data);
      });
    }
  }

  serialize (schema, validator, data) {
    const state = this.prune(schema, data);

    this.validate(validator, data);

    data[this.sanitizeKey(data.name)] = state;

    return JSON.stringify(data);
  }

  write (data) {
    if (typeof data === 'string') {
      data = JSON.parse(data);
    }

    const json = this.serialize(schema, validator, data);
    return this.stream.write(`${json}\n`);
  }
}

module.exports = PruneValidationStream;
