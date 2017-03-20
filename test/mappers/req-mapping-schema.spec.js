/* eslint-env mocha */

'use strict';

const assert = require('assert');

const {
  elasticsearch,
  refreshIndex
} = require('../helpers/elasticsearch');
const {
  mapper
} = require('../../lib/mappers');

const index = 'foo';
const type = 'bar';
const base = 'app';

describe('reqMappingSchema', () => {
  before('create index', () => {
    return elasticsearch.indices.create({ index, body: mapper(base, type) });
  });
  beforeEach('empty index', () => {
    return elasticsearch.deleteByQuery({ index, body: { query: { match_all: {} } } });
  });
  after('delete index', () => {
    return elasticsearch.indices.delete({ index });
  });
  it('url raw', () => {
    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { req: { url: '/foo/bar/baz?a=b&c=d' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { req: { url: '/foo/baz?c=d&d=e' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { req: { url: '/foo/bar/foo?d=e&a=b' } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url:bar` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 2);
        assert.strictEqual(results.hits.hits[0]._id, '1');
        assert.strictEqual(results.hits.hits[1]._id, '3');
      })
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url:"a=b&c=d"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 1);
        assert.strictEqual(results.hits.hits[0]._id, '1');
      });
  });
  it('url path', () => {
    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { req: { url: '/foo/bar/baz?a=b&c=d' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { req: { url: '/foo/baz?c=d&d=e' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { req: { url: '/foo/bar/foo?d=e&a=b' } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url.path:"/foo/bar"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 2);
        assert.strictEqual(results.hits.hits[0]._id, '1');
        assert.strictEqual(results.hits.hits[1]._id, '3');
      })
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url.path:"/foo/bar/baz"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 1);
        assert.strictEqual(results.hits.hits[0]._id, '1');
      });
  });
  it('url query', () => {
    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { req: { url: '/foo/bar?a=b&c=d' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { req: { url: '/foo/bar?c=d&d=e' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { req: { url: '/foo/bar?d=e&a=b' } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url.query:"a=b"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 2);
        assert.strictEqual(results.hits.hits[0]._id, '1');
        assert.strictEqual(results.hits.hits[1]._id, '3');
      })
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.url.query:"/foo/bar"` } } } }))
      .then(results => assert.strictEqual(results.hits.total, 0));
  });
  it('ip raw', () => {
    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { req: { remoteAddress: '192.168.0.42' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { req: { remoteAddress: '192.186.0.42' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { req: { remoteAddress: '192.168.0.24' } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.remoteAddress:"192.186.0.42"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 1);
        assert.strictEqual(results.hits.hits[0]._id, '2');
      });
  });
  it('ip range query', () => {
    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { req: { remoteAddress: '192.168.0.42' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { req: { remoteAddress: '127.0.0.1' } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { req: { remoteAddress: '192.186.0.24' } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { query: { query_string: { query: `${base}.req.remoteAddress:"192.0.0.0/8"` } } } }))
      .then(results => {
        assert.strictEqual(results.hits.total, 2);
        assert.strictEqual(results.hits.hits[0]._id, '1');
        assert.strictEqual(results.hits.hits[1]._id, '3');
      });
  });
});
