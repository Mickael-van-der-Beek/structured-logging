'use strict';

const ip = require('ip');
const url = require('url');

const httpServerRequestSerializer = function httpServerRequestSerializer (req) {
  if (!req) {
    return null;
  }

  const reqIp = req.ip || null;
  const reqIps = req.ips || null;

  const remoteAddresses = reqIps && reqIps.length
    ? reqIps
    : reqIp
      ? [ reqIp ]
      : null;

  const isInternal = ip.isPrivate(remoteAddresses[0]);

  const protocol = req.protocol.substr(-1) !== ':'
    ? `${req.protocol}:`
    : req.protocol;

  const prsPath = req.originalUrl
    ? url.parse(req.originalUrl)
    : null;

  const hostname = req.hostname
    ? (
        req.hostname.indexOf('[') !== -1 &&
        req.hostname.indexOf(']') !== -1
      )
      ? req.hostname.slice(1, -1)
      : req.hostname
    : null;

  const port = hostname && req.headers.host
    ? (
        req.headers.host.indexOf('[') !== -1 &&
        req.headers.host.indexOf(']') !== -1
      )
      ? req.headers.host.substr(
          req.headers.host.indexOf(']') + 2
        )
      : req.headers.host.substr(
          hostname.length + 2
        )
    : protocol === 'https:'
      ? 443
      : protocol === 'http:'
        ? 80
        : null;

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
      hostname,
      port,
      pathname: prsPath.pathname,
      query: prsPath.query,
      hash: prsPath.hash
    },

    headers: req.headers
  };
};

module.exports = httpServerRequestSerializer;
