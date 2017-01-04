'use strict';

const extend = require('extend');
const genericAnalyzers = require('../generic').analyzers;

const httpRequestAnalyzers = extend(
  true,
  {
    domain_analyser: {
      type: 'custom',
      tokenizer: 'dot_split_tokenizer'
    },

    path_analyser: {
      type: 'custom',
      tokenizer: 'slash_hierarchy_tokenizer'
    },

    query_analyser: {
      type: 'custom',
      tokenizer: 'amp_split_tokenizer'
    }
  },
  genericAnalyzers
);

module.exports = httpRequestAnalyzers;
