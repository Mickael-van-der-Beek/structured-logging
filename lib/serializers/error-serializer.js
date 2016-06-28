'use strict';

var bunyan = require('bunyan');
var extend = require('extend');

var constructorGetters = {
  statusCodeError: [
    function () {
      return require('request-promise/errors').StatusCodeError;
    },
    [
      'statusCode',
      'cause'
    ]
  ],

  requestError: [
    function () {
      return require('request-promise/errors').RequestError;
    },
    [
      'cause'
    ]
  ],

  validationError: [
    function () {
      return require('sequelize/lib/errors').ValidationError;
    },
    [
      'errors'
    ]
  ],

  validationErrorItem: [
    function () {
      return require('sequelize/lib/errors').ValidationErrorItem;
    },
    [
      'type',
      'path',
      'value'
    ]
  ]
};

var constructorGetterNames = Object.keys(constructorGetters);

function errorSerializer (err) {
  if (!err || !err.stack) {
    return err;
  }

  var serializedError = bunyan.stdSerializers.err(err);

  var matchedConstructor = false;
  var constructorConfig = null;
  var len = constructorGetterNames.length;
  var i = 0;

  while (matchedConstructor === false && i < len) {
    constructorConfig = constructorGetters[constructorGetterNames[i]];

    try {
      if (err instanceof constructorConfig[0]()) {
        serializedError = extend(
          serializedError,
          constructorConfig[1]
            .reduce(
              function (extendedFields, field) {
                var fieldValue = err[field];

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

