'use strict';

const genericDynamicTemplates = require('../generic').dynamicTemplates;

const httpResponseDynamicTemplates = function httpResponseDynamicTemplates (basePath) {
  return genericDynamicTemplates(basePath);
};

module.exports = httpResponseDynamicTemplates;
