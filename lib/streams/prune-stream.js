'use strict';

const serializers = require('../serializers');

class PruneStream {

  constructor () {
    this.stream = process.stdout;
  }

  write (data) {
    const pruned = Object
      .keys(serializers)
      .reduce(
        (pruned, serializerAlias) => {
          pruned[serializerAlias] = data[serializerAlias];
          return pruned;
        },
        {}
      );
    const json = JSON.stringify(pruned);

    return this.stream.write(json);
  }

}

module.exports = PruneStream;
