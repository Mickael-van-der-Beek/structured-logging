'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const StateTokenizers = extend(
  true,
  {},
  genericTokenizers
);

module.exports = StateTokenizers;
