'use strict';

const tokenizers = {
  slash_hierarchy_tokenizer: {
    type: 'path_hierarchy',
    delimiter: '/'
  },

  amp_split_tokenizer: {
    type: 'pattern',
    pattern: '&'
  },

  stack_tokenizer: {
    pattern: '[\\s]*at\\s+',
    type: 'pattern'
  }
};

module.exports = tokenizers;
