'use strict';

var bunyan = require('bunyan');
var extend = require('extend');

var constructorGetters = {
  statusCodeError: function () {
    return require('request-promise/errors').StatusCodeError;
  },

  requestError: function () {
    return require('request-promise/errors').RequestError;
  },

  validationError: function () {
    return require('sequelize/lib/errors').ValidationError;
  },

  // validationErrorItem: function () {
  //   require('sequelize/lib/errors').ValidationErrorItem
  // },

  databaseError: function () {
    return require('sequelize/lib/errors').DatabaseError;
  },

  timeoutError: function () {
    return require('sequelize/lib/errors').TimeoutError;
  },

  uniqueConstraintError: function () {
    return require('sequelize/lib/errors').UniqueConstraintError;
  },

  foreignKeyConstraintError: function () {
    return require('sequelize/lib/errors').ForeignKeyConstraintError;
  },

  exclusionConstraintError: function () {
    return require('sequelize/lib/errors').ExclusionConstraintError;
  },

  connectionError: function () {
    return require('sequelize/lib/errors').connectionError;
  },

  connectionRefusedError: function () {
    return require('sequelize/lib/errors').ConnectionRefusedError;
  },

  accessDeniedError: function () {
    return require('sequelize/lib/errors').AccessDeniedError;
  },

  hostNotFoundError: function () {
    return require('sequelize/lib/errors').HostNotFoundError;
  },

  hostNotReachableError: function () {
    return require('sequelize/lib/errors').hostNotReachableError;
  },

  invalidConnectionError: function () {
    return require('sequelize/lib/errors').InvalidConnectionError;
  },

  connectionTimedOutError: function () {
    return require('sequelize/lib/errors').ConnectionTimedOutError;
  },

  instanceError: function () {
    return require('sequelize/lib/errors').InstanceError;
  }
};

var constructorGetterNames = Object.keys(constructorGetters);

var fieldExtensions = {
  statusCodeError: [
    'statusCode'
  ],

  requestError: [
    'cause'
  ],

  validationError: [
    'errors'
  ],

  // validationErrorItem: [
  //   'type',
  //   'path',
  //   'value'
  // ],

  databaseError: [],

  timeoutError: [],

  uniqueConstraintError: [],

  foreignKeyConstraintError: [],

  exclusionConstraintError: [],

  connectionError: [],

  connectionRefusedError: [],

  accessDeniedError: [],

  hostNotFoundError: [],

  hostNotReachableError: [],

  invalidConnectionError: [],

  connectionTimedOutError: [],

  instanceError: []
};

module.exports = function (err) {
  if (!err || !err.stack) {
    return err;
  }

  var serializedError = bunyan.stdSerializers.err(err);

  var matchedConstructor = false;
  var len = constructorGetterNames.length;
  var i = 0;

  while (matchedConstructor === false && i < len) {
    try {
      if (err instanceof constructorGetters[constructorGetterNames[i]]()) {
        serializedError = extend(
          serializedError,
          fieldExtensions[constructorGetterNames[i]]
            .reduce(
              function (extendedFields, field) {
                extendedFields[field] = err[field];

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
};
