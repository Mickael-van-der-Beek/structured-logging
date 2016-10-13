'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const ContextAnalyzers = extend(
  genericAnalyzers,
  {}
);

module.exports = ContextAnalyzers;
