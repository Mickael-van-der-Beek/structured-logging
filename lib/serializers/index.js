'use strict';

const objects = require('../objects');

module.exports = {
  req: objects.httpRequest.serializer,

  res: objects.httpResponse.serializer,

  error: objects.error.serializer,

  state: objects.state.serializer
};
