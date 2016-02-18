# structured-logging [![Build Status][circle-image]][circle-url]

Initialises a list of serializers used to format logger input.

## Installation

```shell
$ npm install structured-logging
```

## API

### structuredLogging.serializers

An ```Object``` containing custom [Bunyan](https://github.com/trentm/node-bunyan) serializer functions associated to their name.

Currently only ```req```, ```res``` and ```err``` serializers are available.

### structuredLogging.middleware

A ```Function``` returning an [Express.js](expressjs.com/en/4x/api.html) middleware.
Two arguments can be passed:

* ```logger```, a [Bunyan](https://github.com/trentm/node-bunyan) logger instance
* ```options```, a ```Object``` with options that override the default ones

Currently only the ```event``` key is used.

The child-logger instance will be attached to each request and accessible on the property ```req.logger```.

## Examples

Simple logger with custom serializers example:

```javascript
var structuredLogging = require('structured-logging');
var bunyan = require('bunyan');
var pkg = require('../pkg');

var logger = bunyan.createLogger({
  name: pgk.name,
  serializers: structuredLogging.serializers,
});

logger.error({
	event: 'test-event',
	err: new Error()
});
```

Express.js in version v4.x, middleware example:

```javascript
var structuredLogging = require('structured-logging');
var express = require('express');
var bunyan = require('bunyan');
var pkg = require('../pkg');
var app = express();

var logger = bunyan.createLogger({
  name: pgk.name,
  serializers: structuredLogging.serializers,
});

app.use(
  structuredLogging.middleware(
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

## Metrics

Helper function to provide lightweight metrics through logging:

```js
var structuredLogging = require('structured-logging');
var logger = require('./logger');
var metrics = structuredLogging.metrics(logger);

metrics.record('someMetric', 5);
// results in throttled logs with properties:
// { event: 'app-metric', metric: 'someMetric', value: 5, samples: 1, min: 5, max: 5 }

var getUser = metrics.measure('getUserTiming', function (id) {
  return db.query(`SELECT * FROM users WHERE id = ${id}`);
});
getUser(5).then(console.log);
// results in throttled logs with properties:
// { event: 'app-metric', metric: 'getUserTiming', value: 1234, samples: 1, min: 1234, max: 1234 }
```

[circle-image]: https://circleci.com/gh/Woorank/structured-logging.svg
[circle-url]: https://circleci.com/gh/Woorank/structured-logging
