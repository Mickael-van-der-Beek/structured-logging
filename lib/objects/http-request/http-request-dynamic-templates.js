'use strict';

const genericDynamicTemplates = require('../generic').dynamicTemplates;

const httpRequestDynamicTemplates = function httpRequestDynamicTemplates (basePath) {
  return genericDynamicTemplates(basePath);
};

module.exports = httpRequestDynamicTemplates;
