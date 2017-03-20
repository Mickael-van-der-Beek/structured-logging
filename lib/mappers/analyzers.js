'use strict';

const analyzers = {
  path_analyzer: {
    type: 'custom',
    tokenizer: 'slash_hierarchy_tokenizer',
    char_filter: ['query_char_filter']
  },

  query_analyzer: {
    type: 'custom',
    tokenizer: 'amp_split_tokenizer',
    char_filter: ['path_char_filter']
  },

  stack_analyzer: {
    type: 'custom',
    tokenizer: 'stack_tokenizer',
    filter: [
      'five_token_filter',
      'concat_token_filter'
    ],
    char_filter: ['numeric_char_filter']
  }
};

module.exports = analyzers;
