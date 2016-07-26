'use strict';

const genericDynamicTemplates = require('../generic').dynamicTemplates;

const contextDynamicTemplates = function contextDynamicTemplates (basePath) {
  basePath = basePath.length !== 0 ? `${basePath}.` : basePath;
  const baseKey = basePath.replace(/\./g, '_');

  return []
    .concat(
      genericDynamicTemplates(basePath),
      [{
        [`${baseKey}context_object_template`]: {
          path_match: `${basePath}.*`,
          mapping: {
            index: 'no',
            dynamic: true,
            include_in_all: false
          }
        }
      }]
    );
};

module.exports = contextDynamicTemplates;