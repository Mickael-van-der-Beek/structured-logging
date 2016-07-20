/* global global, describe, it */

'use strict';

var assert = require('chai').assert;
var path = require('path');

var errorSerializer = require('../lib/serializers/error-serializer');

describe('Missing error class modules', function () {
  it('handles the case where the module exists', function () {
    assert.doesNotThrow(function () {
      var RequestError = require('request-promise/errors').RequestError;

      var errorType = RequestError.name;
      var errorMessage = 'This is a test message';
      var serializedError = errorSerializer(
        new RequestError(errorMessage)
      );

      assert.equal(serializedError.name, errorType);
      assert.equal(serializedError.message, errorMessage);
      assert.equal(serializedError.cause, errorMessage);
      assert.isAbove(serializedError.stack.length, 0);
    });
  });

  it('handles the case where the module doesn\'t exist', function () {
    assert.doesNotThrow(function () {
      var RequestError = require('request-promise/errors').RequestError;

      var requestErrorLibPath = path.resolve(
        __dirname,
        '../node_modules/request-promise/lib/errors.js'
      );
      var requestErrorPath = path.resolve(
        __dirname,
        '../node_modules/request-promise/errors.js'
      );

      Object.defineProperty(
        require.cache,
        requestErrorLibPath,
        {
          get: function () {
            throw new Error('Error: Cannot find module \'request-promise\'');
          }
        }
      );

      Object.defineProperty(
        require.cache,
        requestErrorPath,
        {
          get: function () {
            throw new Error('Error: Cannot find module \'request-promise\'');
          }
        }
      );

      var errorType = RequestError.name;
      var errorMessage = 'This is a test message';
      var serializedError = errorSerializer(
        new RequestError(errorMessage)
      );

      assert.equal(serializedError.name, errorType);
      assert.equal(serializedError.message, errorMessage);
      assert.equal(serializedError.cause, undefined);
      assert.isAbove(serializedError.stack.length, 0);
    });
  });
});
