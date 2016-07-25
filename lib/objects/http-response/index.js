'use strict';

const httpResponseDynamicTemplates = require('./http-response-dynamic-templates');
const httpResponseMappings = require('./http-response-mappings');
const httpResponseSerializer = require('./http-response-serializer');
const httpResponseValidator = require('./http-response-validator');

module.exports = {
  dynamicTemplates: httpResponseDynamicTemplates,
  mappings: httpResponseMappings,

  serializer: httpResponseSerializer,

  validator: httpResponseValidator
};
