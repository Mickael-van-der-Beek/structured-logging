'use strict';

var bunyan = require('bunyan');

var httpResponseSerializer = bunyan.stdSerializers.res;

module.exports = httpResponseSerializer;
