'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const StateAnalyzers = extend(
  true,
  {},
  genericAnalyzers
);

module.exports = StateAnalyzers;
