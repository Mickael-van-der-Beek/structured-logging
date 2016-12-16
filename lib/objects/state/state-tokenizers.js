'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const StateTokenizers = extend(
  genericTokenizers,
  {}
);

module.exports = StateTokenizers;
