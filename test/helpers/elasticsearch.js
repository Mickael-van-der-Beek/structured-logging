'use strict';

const es = require('elasticsearch');

const elasticsearch = new es.Client({
  host: process.env.ELASTICSEARCH_HOST
});

const refreshIndex = () => {
  return elasticsearch.indices.refresh({ index: '_all' });
};

module.exports = {
  elasticsearch,
  refreshIndex
};
