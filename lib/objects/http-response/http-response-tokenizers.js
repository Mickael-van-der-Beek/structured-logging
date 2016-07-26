'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const HttpResponseTokenizers = extend(
  genericTokenizers,
  {}
);

module.exports = HttpResponseTokenizers;
