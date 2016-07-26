'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const ErrorTokenizers = extend(
  genericTokenizers,
  {}
);

module.exports = ErrorTokenizers;
