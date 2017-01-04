'use strict';

const extend = require('extend');

const elasticSearchMappingsManager = {

  mapObjectsOnSerializerAliases (serializers, objects) {
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
          };
        },
        {}
      )
      .filter(
        object => object !== undefined
      )
      .reduce(
        (allObjects, object) => {
          const serializerAlias = Object.keys(object)[0];
          const serializerObject = object[serializerAlias];

          allObjects[serializerAlias] = serializerObject;

          return allObjects;
        },
        {}
      );
  },

  generateAnalyzers (serializers, objects) {
    const mappedObjects = this.mapObjectsOnSerializerAliases(serializers, objects);

    return Object
      .keys(mappedObjects)
      .map(
        serializerAlias => mappedObjects[serializerAlias].analyzers
      )
      .reduce(
        (allAnalyzers, serializerAnalyzers) => {
          return extend(
            allAnalyzers,
            serializerAnalyzers
          );
        },
        {}
      );
  },

  generateTokenizers (serializers, objects) {
    const mappedObjects = this.mapObjectsOnSerializerAliases(serializers, objects);

    return Object
      .keys(mappedObjects)
      .map(
        serializerAlias => mappedObjects[serializerAlias].tokenizers
      )
      .reduce(
        (allTokenizers, serializerTokenizers) => {
          return extend(
            allTokenizers,
            serializerTokenizers
          );
        },
        {}
      );
  },

  generateDynamicTemplates (basePath, serializers, objects) {
    const mappedObjects = this.mapObjectsOnSerializerAliases(serializers, objects);

    return Object
      .keys(mappedObjects)
      .map(
        serializerAlias => mappedObjects[serializerAlias].dynamicTemplates(
          basePath ? `${basePath}.${serializerAlias}` : serializerAlias
        )
      )
      .reduce(
        (allDynamicTemplates, serializerDynamicTemplates) => {
          return allDynamicTemplates.concat(serializerDynamicTemplates);
        },
        []
      );
  },

  generateMappings (serializers, objects) {
    const mappedObjects = this.mapObjectsOnSerializerAliases(serializers, objects);

    return Object
      .keys(mappedObjects)
      .map(
        serializerAlias => {
          return {
            [serializerAlias]: mappedObjects[serializerAlias]
          };
        }
      )
      .reduce(
        (allMappings, object) => {
          const serializerAlias = Object.keys(object)[0];
          const serializerMappings = object[serializerAlias].mappings;

          allMappings[serializerAlias] = serializerMappings;

          return allMappings;
        },
        {}
      );
  },

  generate (basePath, type, serializers, objects) {
    basePath = basePath || 'app';
    type = type || '_default_';

    return {
      settings: {
        analysis: {
          analyzer: this.generateAnalyzers(serializers, objects),
          tokenizer: this.generateTokenizers(serializers, objects)
        }
      },
      mappings: {
        [type]: {
          dynamicTemplates: this.generateDynamicTemplates(basePath, serializers, objects),

          properties: {
            [basePath]: this.generateMappings(serializers, objects)
          }
        }
      }
    };
  }

};

module.exports = elasticSearchMappingsManager;
