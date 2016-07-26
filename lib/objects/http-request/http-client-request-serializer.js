'use strict';

const ip = require('ip');
const proxyaddr = require('proxy-addr');
const url = require('url');

const trust = [
  'loopback',
  'linklocal',
  'uniquelocal'
];

const httpClientRequestSerializer = function httpClientRequestSerializer (req) {
  if (!req) {
    return null;
  }

  const reqIp = proxyaddr(req, trust) || null;
  const reqIps = proxyaddr
    .all(req, trust)
    .filter(ip => ip !== undefined);

  const remoteAddresses = reqIps.length
    ? reqIps
    : reqIp
      ? [ reqIp ]
      : null;

  const isInternal = remoteAddresses
    ? ip.isPrivate(remoteAddresses[0])
    : null;

  const protocol = req.agent && req.agent.protocol
    ? req.agent.protocol
    : null;

  const prsPath = req.uri
    ? url.parse(req.uri)
    : {};

  const hostname = prsPath.hostname || null;

  const port = (
    prsPath.port ||
    (
      protocol === 'https:'
      ? 443
      : protocol === 'http:'
        ? 80
        : null
    )
  );

  return {
    origin: 'client',

    isInternal,

    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,

    method: req.method,

    remoteAddresses,
    remoteFamily: req.socket.remoteFamily,
    remotePort: req.socket.remotePort,

    uri: {
      protocol,
      hostname,
      port,
      pathname: prsPath.pathname,
      query: prsPath.query,
      hash: prsPath.hash
    },

    headers: req.headers
  };
};

module.exports = httpClientRequestSerializer;
