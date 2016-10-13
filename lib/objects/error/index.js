'use strict';

const errorAnalyzers = require('./error-analyzers');
const errorDynamicTemplates = require('./error-dynamic-templates');
const errorMappings = require('./error-mappings');
const errorSerializer = require('./error-serializer');
const errorTokenizers = require('./error-tokenizers');
const errorValidator = require('./error-validator');

module.exports = {
  analyzers: errorAnalyzers,
  tokenizers: errorTokenizers,
  dynamicTemplates: errorDynamicTemplates,
  mappings: errorMappings,

  serializer: errorSerializer,

  validator: errorValidator
};
