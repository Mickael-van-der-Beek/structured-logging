'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const httpResponseAnalyzers = extend(
  genericAnalyzers,
  {}
);

module.exports = httpResponseAnalyzers;
