'use strict';

const bunyan = require('bunyan');
const errorValidator = require('./error-validator');
const extend = require('extend');
const genericSerializer = require('../generic').serializer;
const RequestError = require('request-promise/errors').RequestError;
const StatusCodeError = require('request-promise/errors').StatusCodeError;

const constructorGetters = {
  statusCodeError: [
    () => {
      return StatusCodeError;
    },
    [
      'statusCode'
    ]
  ],

  requestError: [
    () => {
      return RequestError;
    },
    [
      'cause'
    ]
  ]
};

const constructorGetterNames = Object.keys(constructorGetters);

const errorSerializer = function errorSerializer (err) {
  return genericSerializer(
    (err) => {
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
    },
    errorValidator,
    err
  );
};

module.exports = errorSerializer;
