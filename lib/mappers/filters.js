'use strict';

const analyzers = {
  five_token_filter: {
    type: 'limit',
    max_token_count: '5'
  },

  concat_token_filter: {
    type: 'fingerprint',
    max_output_size: '9999'
  }
};

module.exports = analyzers;
