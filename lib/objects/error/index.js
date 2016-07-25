'use strict';

const errorDynamicTemplates = require('./error-dynamic-templates');
const errorMappings = require('./error-mappings');
const errorSerializer = require('./error-serializer');
const errorValidator = require('./error-validator');

module.exports = {
  dynamicTemplates: errorDynamicTemplates,
  mappings: errorMappings,

  serializer: errorSerializer,

  validator: errorValidator
};
