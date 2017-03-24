'use strict';

const reqSerializer = require('./req-serializer');
const resSerializer = require('./res-serializer');

module.exports = {
  req: reqSerializer,
  res: resSerializer
};
