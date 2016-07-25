'use strict';

const httpRequestDynamicTemplates = require('./http-request-dynamic-templates');
const httpRequestMappings = require('./http-request-mappings');
const httpRequestSerializer = require('./http-request-serializer');
const httpRequestValidator = require('./http-request-validator');

module.exports = {
  dynamicTemplates: httpRequestDynamicTemplates,
  mappings: httpRequestMappings,

  serializer: httpRequestSerializer,

  validator: httpRequestValidator
};
