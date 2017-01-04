'use strict';

const extend = require('extend');
const genericTokenizers = require('../generic').tokenizers;

const HttpRequestTokenizers = extend(
  true,
  {
    dot_split_tokenizer: {
      type: 'pattern',
      pattern: '\\.'
    },

    slash_hierarchy_tokenizer: {
      type: 'path_hierarchy',
      tokenizer: 'slash_hierarchy_tokenizer'
    },

    amp_split_tokenizer: {
      type: 'pattern',
      pattern: '&'
    }
  },
  genericTokenizers
);

module.exports = HttpRequestTokenizers;
