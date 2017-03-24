'use strict';

const PruneValidationStream = require('./prune-validation-stream');

const createPruneValidationStream = (options, config) => Object.assign(
  {},
  {
    type: 'raw',
    stream: new PruneValidationStream(config)
  },
  options
);

module.exports = {
  PruneValidationStream,
  createPruneValidationStream
};
