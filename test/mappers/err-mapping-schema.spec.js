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

describe('errMappingSchema', () => {
  before('create index', () => {
    return elasticsearch.indices.create({ index, body: mapper(base, type) });
  });
  beforeEach('empty index', () => {
    return elasticsearch.deleteByQuery({ index, body: { query: { match_all: {} } } });
  });
  after('delete index', () => {
    return elasticsearch.indices.delete({ index });
  });
  it('stack aggregation', () => {
    const stack1 = `
      Error
          at repl:1:1
          at sigintHandlersWrap (vm.js:22:35)
          at sigintHandlersWrap (vm.js:96:12)
          at ContextifyScript.Script.runInThisContext (vm.js:21:12)
          at REPLServer.defaultEval (repl.js:313:29)
          at bound (domain.js:280:14)
          at REPLServer.runBound [as eval] (domain.js:293:12)
          at REPLServer.<anonymous> (repl.js:513:10)
          at emitOne (events.js:101:20)
          at REPLServer.emit (events.js:188:7)
    `;
    const stack2 = `
      TypeError
          at [eval]:1:13
          at ContextifyScript.Script.runInThisContext (vm.js:25:33)
          at Object.exports.runInThisContext (vm.js:77:17)
          at Object.<anonymous> ([eval]-wrapper:6:22)
          at Module._compile (module.js:556:32)
          at bootstrap_node.js:357:29
          at _combinedTickCallback (internal/process/next_tick.js:67:7)
          at process._tickCallback (internal/process/next_tick.js:98:9)
    `;
    const stack3 = `
      Error
          at repl:2:2
          at sigintHandlersWrap (vm.js:33:46)
          at sigintHandlersWrap (vm.js:07:23)
          at ContextifyScript.Script.runInThisContext (vm.js:32:23)
          at REPLServer.defaultEval (repl.js:424:30)
          at bound (domain.js:391:25)
          at REPLServer.runBound [as eval] (domain.js:304:23)
          at REPLServer.<anonymous> (repl.js:624:21)
          at emitOne (events.js:212:31)
          at REPLServer.emit (events.js:290:8)
    `;

    return Promise
      .resolve()
      .then(() => elasticsearch.create({ index, type, id: '1', body: { [base]: { err: { stack: stack1 } } } }))
      .then(() => elasticsearch.create({ index, type, id: '2', body: { [base]: { err: { stack: stack2 } } } }))
      .then(() => elasticsearch.create({ index, type, id: '3', body: { [base]: { err: { stack: stack3 } } } }))
      .then(() => refreshIndex())
      .then(() => elasticsearch.search({ index, type, body: { aggs: { top_errors: { terms: { field: `${base}.err.stack` } } } } }))
      .then(results => {
        assert.strictEqual(results.aggregations.top_errors.buckets[0].doc_count, 2);
        assert.strictEqual(results.aggregations.top_errors.buckets[1].doc_count, 1);
      });
  });
});
