'use strict';

const genericAnalizers = require('./generic-analyzers');
const genericDynamicTemplates = require('./generic-dynamic-templates');
const genericMappings = require('./generic-mappings');
const genericSerializer = require('./generic-serializer');
const genericTokenizers = require('./generic-tokenizers');
const genericValidator = require('./generic-validator');

module.exports = {
  analizers: genericAnalizers,
  tokenizers: genericTokenizers,
  dynamicTemplates: genericDynamicTemplates,
  mappings: genericMappings,

  serializer: genericSerializer,

  validator: genericValidator
};
