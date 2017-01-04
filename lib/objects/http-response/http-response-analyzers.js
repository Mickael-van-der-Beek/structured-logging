'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const httpResponseAnalyzers = extend(
  true,
  {},
  genericAnalyzers
);

module.exports = httpResponseAnalyzers;
