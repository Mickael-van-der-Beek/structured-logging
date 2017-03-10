'use strict';

const dot = require('dot-object');

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
    serializedData.validationErrors = validationErrors.map(validationError => {
      validationError.schema = JSON.stringify(validationError.schema);
      validationError.parentSchema = JSON.stringify(validationError.parentSchema);
      validationError.data = JSON.stringify(validationError.data);
      return validationError;
    });

    serializedData.validationErrors.forEach(validationError => {
      dot.del(validationError.dataPath.slice(1), serializedData);
    });
  }

  return serializedData;
};

module.exports = genericSerializer;
