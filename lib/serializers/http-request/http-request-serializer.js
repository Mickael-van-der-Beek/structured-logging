'use strict';

const ip = require('ip');
const proxyaddr = require('proxy-addr');
const url = require('url');

function httpRequestSerializer (req) {
  if (!req || !req.socket) {
    return null;
  }

  const reqIp = req.ip || proxyaddr(req, true);
  const reqIps = req.ips || proxyaddr.all(req, true);
  const remoteAddresses = reqIps.length
    ? reqIps
    : [ reqIp ];

  const isInternal = ip.isPrivate(remoteAddresses[0]);

  const protocol = req.protocol.slice(-1) === ':'
    ? req.protocol
    : `${req.protocol}:`;
  const hostname = req.hostname || null;
  const port = (
    req.port ||
    (
      protocol === 'http:'
        ? 80
        : protocol === 'https:'
          ? 443
          : null
    )
  );
  const prsPath = req.originalUrl
    ? url.parse(req.originalUrl)
    : req.uri;

  console.log('REQ_ORIGINAL_URL=', req.originalUrl);
  console.log('REQ_URI=', req.uri);
  console.log('REQ_PRS_HASH=', url.parse(req.originalUrl).hash);

  return {
    isInternal: isInternal,

    httpVersionMajor: req.httpVersionMajor,
    httpVersionMinor: req.httpVersionMinor,

    method: req.method,

    remoteAddresses: remoteAddresses,
    remoteFamily: req.socket.remoteFamily,
    remotePort: req.socket.remotePort,

    uri: {
      protocol: protocol,
      hostname: hostname,
      port: port,
      pathname: prsPath.pathname,
      query: prsPath.query,
      hash: prsPath.hash
    },

    headers: req.headers
  };
}

module.exports = httpRequestSerializer;
