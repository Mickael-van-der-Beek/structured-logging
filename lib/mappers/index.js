'use strict';

const analyzers = require('./analyzers');
const charFilters = require('./char-filters');
const filters = require('./filters');
const tokenizers = require('./tokenizers');

const defaultMappingSchema = require('./default-mapping-schema');
const errMappingSchema = require('./err-mapping-schema');
const reqMappingSchema = require('./req-mapping-schema');
const resMappingSchema = require('./res-mapping-schema');

const schema = defaultMappingSchema;
schema.properties = Object.assign(
  {},
  schema.properties,
  {
    err: errMappingSchema,
    req: reqMappingSchema,
    res: resMappingSchema
  }
);

const mapper = (basePath, type) => {
  basePath = basePath || 'app';
  type = type || '_default_';

  return {
    settings: {
      analysis: {
        analyzer: analyzers,
        char_filter: charFilters,
        filter: filters,
        tokenizer: tokenizers
      }
    },
    mappings: {
      [type]: {
        properties: {
          [basePath]: schema
        }
      }
    }
  };
};

module.exports = {
  schema,
  mapper
};
