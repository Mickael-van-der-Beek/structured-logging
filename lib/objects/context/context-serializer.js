'use strict';

const genericSerializer = require('../generic').serializer;
const contextValidator = require('./context-validator');

const contextSerializer = function contextSerializer (context) {
  return genericSerializer(
    context => context,
    contextValidator,
    context
  );
};

module.exports = contextSerializer;
