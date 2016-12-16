# structured-logging [![Build Status][circle-image]][circle-url]

The ```structured-logging``` NPM module provides two features:
  - a list of bunyan compatible serializers that are pruned and validated against a JSON schema
  - an ElasticSearch mappings generator that fits the outputted data

## Installation

```shell
$ npm install structured-logging
```

## Object definition exlanation

In ```structured-logging```, objects are entities that you want to log.

Currently only ```HTTP request```, ```HTTP response```, ```Error``` and ```State``` objects are available.

Each object need to have these following files defines in it's folder:

  * ```OBJECT_NAME-serializer.js```, a function that maps / normalizes interesting properties from the input object to an output object
  * ```OBJECT_NAME-validator.js```, an [AJV](https://github.com/epoberezkin/ajv) validator instance whith a JSON schema validating your output object
  * ```OBJECT_NAME-mappings.js```, an ElasticSearch mapping schema used to specify how each field will be stored, tokenized, analyzed, indexed and searched
  * ```OBJECT_NAME-dynamic-templates.js```: a list of ElasticSearch dynamic_templates which let you define mapping properties dynamicaly assing them to wildcard paths (e.g: ```state.*```)
  * ```OBJECT_NAME-analyzers.js```: a list of custom ElasticSearch analyzer definitions in case the mappings file needs non-standard analyzers
  * ```OBJECT_NAME-tokenizers.js```: a list of custom ElasticSearch tokenizer definitions in case the mappings file needs non-standard tokenizers


## Serializers API

### structuredLogging.serializers

An ```Object``` containing custom [Bunyan](https://github.com/trentm/node-bunyan) serializer functions associated to their alias.

Currently only ```req```, ```res```, ```error``` and ```state``` serializers are available.

  * ```req```: should be used to log request objects coming from the server (e.g: ```express```) or the client (e.g: ```request``` or ```request-promise```)
  * ```res```: should be used to log response objects coming from the server (e.g: ```express```) or the client (e.g: ```request``` or ```request-promise```)
  * ```error```: should be used to log error objects coming from the V8 (e.g: ```Error``` or ```TypeError``` instances) or libraries (e.g: ```StatusCodeError```)
  * ```state```: should be used to log any app specific / stateual data.

/!\ ```state``` data will be stored but not indexed ! /!\

### Examples

Simple logger with custom serializers example:

```javascript
const structuredLogging = require('structured-logging');
const bunyan = require('bunyan');
const pkg = require('../pkg');

const logger = bunyan.createLogger({
  name: pgk.name,
  serializers: structuredLogging.serializers,
});

logger.error({
  event: 'test-event',
  error: new Error()
});
```

## Middlewares API

### structuredLogging.middlewares

An ```Object``` containing custom middleware functions to log server or client request / response pairs.

Currently only ```server``` and ```client``` middlewares are available.

  * ```server```: should be used to log request / response pairs coming server (e.g: ```express```)
  * ```client```: should be used to log request / response pairs coming client (e.g: ```request``` or ```request-promise```)

### structuredLogging.middlewares.server

A ```Function``` returning an [Express.js](expressjs.com/en/4x/api.html) middleware.
Two arguments can be passed:

  * ```logger```, a [Bunyan](https://github.com/trentm/node-bunyan) logger instance
  * ```options```, a ```Object``` with options that override the default ones

Currently only the ```event``` key is used.

The child-logger instance will be attached to each request and accessible on the property ```req.logger```.

### structuredLogging.middlewares.client

A ```Function``` returning that returns exactly the same data that was passed to it to be used in a ```.then()```.
Two arguments can be passed:

  * ```logger```, a [Bunyan](https://github.com/trentm/node-bunyan) logger instance
  * ```options```, a ```Object``` with options that override the default ones

Currently only the ```event``` key is used.

The child-logger instance will be attached to each request and accessible on the property ```req.logger```.

### Examples

Express.js in version v4.x, middleware example:

```javascript
const structuredLogging = require('structured-logging');
const express = require('express');
const bunyan = require('bunyan');
const pkg = require('../pkg');
const app = express();

const logger = bunyan.createLogger({
  name: pgk.name,
  serializers: structuredLogging.serializers,
});

app.use(
  structuredLogging.middlewares.server(
    logger,
    {
		event: 'test-event'
	}
  )
);

app.get('/', function (req, res) {
  res.status(200).end();
});

app.listen(3000);
```

Request-promise, middleware example:

```javascript
const structuredLogging = require('structured-logging');
const requestPromise = require('request-promise');
const bunyan = require('bunyan');
const pkg = require('../pkg');

requestPromise({
  uri: 'http://example.com',

  // Note: This setting makes request return the whole response object instead of just the body
  resolveWithFullResponse: true,
  // Note: This setting sets the res.elapsedTime property in request
  time: true
})
  .then(
    res => structuredLogging.middlewares.client(res)
  );
```

## Elasticsearch mappings API

### structuredLogging.mappingsManagers

An ```Object``` containing (currently one) mapping manager that uses the ```analyzers```, ```tokenizers```, ```dynamic_templates``` and ```mappings``` for each serializer object and merges them into an ElasticSearch compatible mappings object.

### structuredLogging.mappingsManagers.elasticSearch

A ```Function``` returning an ElasticSearch mappings object.
Four arguments have to be passed:

  * ```basePath```, a ```String```, the prefix to which the outputed data will be appended to (defaults to ```'app'```)
  * ```type```, a ```String```, the ElasticSearch type to specify the mapping properties for (defaults to ```'__default__'```)
  * ```serializers```, an ```Object```, the ```structured-logging``` serializers mapped to the bunyan aliases as in your app
  * ```objects```, an ```Object```, the ```structured-logging``` objects.property

### Examples

Elasticsearch, mappings generation example:

```javascript
const structuredLogging = require('structured-logging');
const util = require('util');

console.log(
  util.inspect(
    structuredLogging
      .mappingsManagers
      .elasticSearch
      .generate('app', '__default__', structuredLogging.serializers, structuredLogging.objects),
    {
      colors: true,
      depth: 100
    }
  )
);
```

[circle-image]: https://circleci.com/gh/Woorank/structured-logging.svg
[circle-url]: https://circleci.com/gh/Woorank/structured-logging
