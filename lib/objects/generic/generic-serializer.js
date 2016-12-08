'use strict';

const genericSerializer = function genericSerializer (serializer, validator, data) {
  if (!data) {
    return null;
  }

  let serializationError = null;
  let validationErrors = null;
  let serializedData = {};

  try {
    serializedData = serializer(data);
  } catch (err) {
    serializationError = err;
  }

  if (serializationError) {
    serializedData.hasSerializationError = true;
    serializedData.serializationError = serializationError;
  }

  validator(serializedData);

  validationErrors = validator.errors;

  if (validationErrors) {
    serializedData.hasValidationErrors = true;
    serializedData.validationErrors = validationErrors;
  }

  return serializedData;
};

module.exports = genericSerializer;
