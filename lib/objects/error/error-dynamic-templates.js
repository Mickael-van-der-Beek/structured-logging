'use strict';

const genericDynamicTemplates = require('../generic').dynamicTemplates;

const errorDynamicTemplates = function errorDynamicTemplates (basePath) {
  return genericDynamicTemplates(basePath);
};

module.exports = errorDynamicTemplates;
