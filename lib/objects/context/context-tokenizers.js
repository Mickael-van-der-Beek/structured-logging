'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const ContextTokenizers = extend(
  genericTokenizers,
  {}
);

module.exports = ContextTokenizers;
