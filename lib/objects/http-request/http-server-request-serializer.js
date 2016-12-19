'use strict';

const ip = require('ip');
const proxyaddr = require('proxy-addr');
const URI = require('urijs');

const trust = [
  'loopback',
  'linklocal',
  'uniquelocal'
];

const httpServerRequestSerializer = function httpServerRequestSerializer (req) {
  if (!req) {
    return null;
  }

  const reqIp = proxyaddr(req, trust) || null;
  const reqIps = proxyaddr
    .all(req, trust)
    .filter(ip => ip !== undefined);

  const remoteAddresses = reqIps && reqIps.length
    ? reqIps
    : reqIp
      ? [ reqIp ]
      : null;

  const isInternal = remoteAddresses && remoteAddresses.length
    ? ip.isPrivate(remoteAddresses[0])
    : null;

  const uri = new URI(req.originalUrl);
  uri.protocol(req.protocol);
  uri.host(req.headers.host);
  uri.normalize();

  const protocol = uri.protocol();
  const port = parseInt(uri.port() || URI.defaultPorts[protocol] || 0, 10);

  return {
    origin: 'server',

    isInternal,

    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,

    method: req.method,

    remoteAddresses,
    remoteFamily: req.socket.remoteFamily,
    remotePort: req.socket.remotePort,

    uri: {
      protocol,
      hostname: uri.hostname(),
      port,
      pathname: uri.pathname(),
      query: uri.query() || null,
      hash: uri.hash() || null
    },

    headers: Object.assign({}, req.headers)
  };
};

module.exports = httpServerRequestSerializer;
