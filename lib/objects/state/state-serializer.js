'use strict';

const genericSerializer = require('../generic').serializer;
const stateValidator = require('./state-validator');

const stateSerializer = function stateSerializer (state) {
  return genericSerializer(
    state => state,
    stateValidator,
    state
  );
};

module.exports = stateSerializer;
