'use strict';

const ip = require('ip');
// const proxyaddr = require('proxy-addr');
const url = require('url');

// const trust = [
//   'loopback',
//   'linklocal',
//   'uniquelocal'
// ];

function httpRequestSerializer (req) {
  if (!req) {
    return null;
  }

  let remoteAddresses;
  let isInternal;

  if (req.ip || req.ips) {
    const reqIp = (
      // Note: Express case
      req.ip ||
      // Note: Request case
      // proxyaddr(req, trust) ||
      null
    );
    const reqIps = (
      // Note: Express case
      req.ips ||
      // Note: Request case
      // proxyaddr.all(req, trust) ||
      []
    );

    remoteAddresses = reqIps && reqIps.length
      ? reqIps
      : reqIp
        ? [ reqIp ]
        : null;

    isInternal = ip.isPrivate(remoteAddresses[0]);
  }

  const protocol = req.protocol
    // Note: Express case
    ? req.protocol.substr(-1) !== ':'
        ? `${req.protocol}:`
        : req.protocol
    // Note: Request case
    : req.agent && req.agent.protocol
      ? req.agent.protocol
      : null;

  const prsPath = req.originalUrl
    // Note: Express case
    ? url.parse(req.originalUrl)
    // Note: Request case
    : url.parse(req.uri);

  const hostname = (
    // Note: Express case
    req.hostname ||
    // Note: Request case
    prsPath.hostname ||
    null
  );
  const port = hostname && req.headers.host
    // Note: Express case
    ? req.headers.host.substr(hostname.length + 1)
    // Note: Request case
    : prsPath.port
      ? prsPath.port
      : protocol === 'https:'
          ? 443
          : protocol === 'http:'
            ? 80
            : null;

  console.log('PRS_PATH=', prsPath);
  console.log('REQ_HOSTNAME=', hostname);

  return {
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
}

module.exports = httpRequestSerializer;
