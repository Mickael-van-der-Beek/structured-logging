'use strict';

const genericDynamicTemplates = function genericDynamicTemplates (basePath) {
  basePath = basePath.length !== 0 ? `${basePath}.` : basePath;
  const baseKey = basePath.replace(/\./g, '_');

  return [{
    [`${baseKey}serializationError_object_template`]: {
      path_match: `${basePath}serializationError.*`,
      mapping: {
        index: 'no',
        dynamic: true,
        include_in_all: false
      }
    }
  }, {
    [`${baseKey}validationErrors_nested_template`]: {
      path_match: `${basePath}validationErrors.*`,
      mapping: {
        index: 'no',
        dynamic: true,
        include_in_all: false
      }
    }
  }];
};

module.exports = genericDynamicTemplates;
