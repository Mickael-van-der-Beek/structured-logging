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
    console.log(err.stack);
    serializationError = err;
  }

  if (serializationError) {
    serializedData.hasSerializationError = true;
    serializedData.serializationError = serializationError;
  } else {
    serializedData.hasSerializationError = false;
    serializedData.serializationError = null;
  }

  validator(serializedData);

  validationErrors = validator.errors;

  if (validationErrors) {
    serializedData.hasValidationErrors = true;
    serializedData.validationErrors = validationErrors;
  } else {
    serializedData.hasValidationErrors = false;
    serializedData.validationErrors = null;
  }

  return serializedData;
};

module.exports = genericSerializer;
