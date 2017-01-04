'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const HttpResponseTokenizers = extend(
  true,
  {},
  genericTokenizers
);

module.exports = HttpResponseTokenizers;
