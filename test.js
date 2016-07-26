'use strict';

const util = require('util');
const sl = require('./lib');
const mm = sl.mappingsManagers;
const esmm = mm.elasticSearch;

console.log(
  util.inspect(
    esmm.generate('app', sl.serializers, sl.objects),
    {
      colors: true,
      depth: 100
    }
  )
);
