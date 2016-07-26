'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const ErrorAnalyzers = extend(
  genericAnalyzers,
  {}
);

module.exports = ErrorAnalyzers;
