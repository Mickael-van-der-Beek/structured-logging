'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const StateAnalyzers = extend(
  genericAnalyzers,
  {}
);

module.exports = StateAnalyzers;
