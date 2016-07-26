'use strict';

const elasticSearchMappingsManager = {

  generateMappings (serializers, objects) {
    return Object
      .keys(serializers)
      .map(
        serializerAlias => {
          return {
            [serializerAlias]: Object
              .keys(objects)
              .map(
                objectName => objects[objectName]
              )
              .filter(
                object => object.serializer === serializers[serializerAlias]
              )
              .pop()
              .mappings
          };
        }
      )
      .reduce(
        (allMappings, serializer) => {
          const serializerAlias = Object.keys(serializer)[0];
          const serializerMappings = serializer[serializerAlias];

          allMappings[serializerAlias] = serializerMappings;

          return allMappings;
        },
        {}
      );
  },

  generateDynamicTemplates (basePath, objects) {
    return Object
      .keys(objects)
      .map(
        objectName => objects[objectName].dynamicTemplates(basePath)
      )
      .reduce(
        (allDynamicTemplates, dynamicTemplates) => {
          return allDynamicTemplates.concat(dynamicTemplates);
        },
        []
      );
  },

  generate (basePath, serializers, objects) {
    return {
      mapping: {
        dynamicTemplates: this.generateDynamicTemplates(basePath, objects),

        properties: {
          [basePath]: this.generateMappings(serializers, objects)
        }
      }
    };
  }

};

module.exports = elasticSearchMappingsManager;
