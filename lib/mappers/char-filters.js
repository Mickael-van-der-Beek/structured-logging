'use strict';

const charFilters = {
  path_char_filter: {
    type: 'pattern_replace',
    pattern: '([^?#]+(\\?|#))',
    replacement: ''
  },

  query_char_filter: {
    type: 'pattern_replace',
    pattern: '(\\?[^#]+#?)',
    replacement: ''
  },

  numeric_char_filter: {
    type: 'pattern_replace',
    pattern: '[0-9]+',
    replacement: ''
  }
};

module.exports = charFilters;
