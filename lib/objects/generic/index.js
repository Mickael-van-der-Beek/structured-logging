'use strict';

const genericDynamicTemplates = require('./generic-dynamic-templates');
const genericMappings = require('./generic-mappings');
const genericSerializer = require('./generic-serializer');
const genericValidator = require('./generic-validator');

module.exports = {
  dynamicTemplates: genericDynamicTemplates,
  mappings: genericMappings,

  serializer: genericSerializer,

  validator: genericValidator
};
