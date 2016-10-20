'use strict';

const bunyan = require('bunyan');
const extend = require('extend');

const constructorGetters = {
  statusCodeError: [
    () => {
      return require('request-promise/errors').StatusCodeError;
    },
    [
      'statusCode',
      'cause'
    ]
  ],

  requestError: [
    () => {
      return require('request-promise/errors').RequestError;
    },
    [
      'cause'
    ]
  ]
};

const constructorGetterNames = Object.keys(constructorGetters);

function errorSerializer (err) {
  if (!err || err instanceof Error === false) {
    return null;
  }

  let serializedError = bunyan.stdSerializers.err(err);

  let matchedConstructor = false;
  let constructorConfig = null;
  const len = constructorGetterNames.length;
  let i = 0;

  while (matchedConstructor === false && i < len) {
    constructorConfig = constructorGetters[constructorGetterNames[i]];

    try {
      if (err instanceof constructorConfig[0]()) {
        serializedError = extend(
          serializedError,
          constructorConfig[1]
            .reduce(
              (extendedFields, field) => {
                let fieldValue = err[field];

                if (fieldValue instanceof Error) {
                  fieldValue = errorSerializer(fieldValue);
                }

                extendedFields[field] = fieldValue;

                return extendedFields;
              },
              {}
            )
        );

        matchedConstructor = true;
      }
    } catch (e) {}

    i += 1;
  }

  return serializedError;
}

module.exports = errorSerializer;
