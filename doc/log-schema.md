# Log Schema

## Introduction

This is a proposal for a fixed log schema for all our web applications.
Both the client request side and the server response side will be logged.
Each log object contains the request, the response and the error objects; all optional.

## Caveats

- Some errors like Sequelize validation errors contains lists of errors
(Jan and I think that in this case we should just pick the first error in that list)

- Technically only the custom x-woorank-id header is needed to link a log object created by an internal request made by a client to the corresponding server log object. But if you want to aggregate or query by pairs of (app.name, request.headers.x-woorank-app-name) you'd need to make a query similar to a join which isn't possible in ElasticSearch.
(For this a propose that we duplicate the app information of the log object inside the x-worrank-* headers.)

- It's difficult to create a fixed schema when there is no fixed enforced header list.
(To remdiate to this issue, I think we should log the standard HTTP headers as well as some defacto standard ones like x-forwarded-for and filter the the ones that we agree are not interesting like the date header.)

- For security purposes I would remove all headers that containt secrets or leak information like authorization (bearer tokens), cookie / cookie2 (sessions), ETag (cache state), referrer / referer (leaks internal URLs), x-csrf-token (CSRF token).
(If we still want this information we could compromise by only logging the length of the value for example or if it contains comas / semi-colons that indicate list values in HTTP headers)

- The body would be too big to log.
(Same as the previous bullet point, we could log the length of the body so as to not blindly trust the content-length header.)

- There are a some headers that have duplicate meanings or have a corresponding x-* header.
(It might be interesting to then merge them together.)

## Proposed Schema

This is the first draft for the log schema.
The header list contains all the standard HTTP headers as well as the most used non-standard ones.
I also added the proposed x-woorank-* headers.
The final list of headers we log will be drastically shorter since a lot of these are not interesting or non-standard / legacy.

```json
{
	// Note: Unique identifier and primary key
	"id": "string",
	// Note: Date of the current day in DD-MM-YYYY format
	"type": "string",
	// Note: Logstash index name
	"index": "string",
	// Note: Exact insertion date with second precisions
	"timestamp": "date",

	// Note: Host's IPv4 address
	// (Not sure how to get this information?)
	"host": "string",
	// Note: Information on the Docker container running
	"container": {
		"id": "string",
		"name": "string",
	},
	// Note: Information on the Docker image running
	"image": {
		"id": "string",
		"name": "string",
	},
	// Note: Process id (Starts at 1 then is increments in Docker I think)
	"pid": "number",

	// Note: Application related information
	"app": {
		// Note: Application name (as in package.json)
		"name": "string",
		// Note: Application version (as in package.json)
		"version": "string",
		// Note: CircleCI / Docker build number (passed by Dockerfile ENV variables)
		"build": "string",
		// Note: Docker command with which the application was launched with
		"command": "string",
		// Note: Environement with which the application was launched with (i.e: test or prod not the NODE_ENV)
		"environement": "string",
	},

	// Note: Log level of this message
	// (Decide on format / standard levels for each type of event)
	// e.g: info, warning, error ...etc.
	"level": "number",
	"event": "string",

	"httpVersion": "string",

	"request": {
		// Note: If the log originates from the client that made the request
		"isOrigin": "boolean",
		// Note: If the request was made from and to an internal service
		"isInternal": "boolean",
		// Note: IPv4 address of the client making the request
		"address": "string",
		// Note: TCP port of the client making the request
		"port": "number", // Note: Not really useful imo
		"method": "string",
		"url": {
			"protocol": "string",
			"auth": "string", // Note: Probably insecure to log this
			"hostname": "string",
			"port": "number",
			"pathname": "string",
			"query": "string", // Note: We have the choice between a string or an object
			"hash": "string",
		},
		"headers": {
			// Note: General headers
			"connection": "string",
			"date": "string",
			"mime-version": "string",
			"trailer": "string",
			"transfer-encoding": "string",
			"upgrade": "string",
			"via": "string",

			// Note: General caching headers
			"cache-control": "string",
			"pragma": "string",

			// Note: Request headers
			"client-ip": "string",
			"from": "string",
			"host": "string",
			"origin": "string", // TODO: check RFC
			"referer": "string", // Note: Also spelled "referrer"
			"ua-color": "string",
			"ua-cpu": "string",
			"ua-disp": "string",
			"ua-os": "string",
			"ua-pixels": "string",
			"user-agent": "string",
			"client-ip": "string",

			// Note: Accept headers
			"accept": "string",
			"accept-charset": "string",
			"accept-encoding": "string",
			"accept-language": "string",
			"accept-datetime": "string", // TODO: check RFC
			"te": "string",

			// Note: Conditional request headers
			"expect": "string",
			"if-match": "string",
			"if-modified-since": "string",
			"if-none-match": "string",
			"if-range": "string",
			"if-unmodified-since": "string",
			"range": "string",

			// Note: Request security headers
			"authorization": "string",
			"cookie": "string",
			"cookie2": "string",

			// Note: Proxy request headers
			"max-forwards": "string",
			"proxy-authorization": "string",
			"proxy-connection": "string",
			"forwarded": "string", // TODO: check RFC

			// Note: HTTP non-standard extension (X-) headers
			"x-cache": "string",
			"x-forwarded-for": "string",
			"x-forwarded-host": "string",
			"x-forwarded-proto": "string",
			"x-pad": "string",
			"x-serial-number": "string",
			"x-requested-with": "string",
			"dnt": "string",
			"front-end-https": "string", // Note: Microsoft bullshit
			"x-http-method-override": "string",
			"x-att-devideid": "string",
			"x-wap-profile": "string",
			"proxy-connection": "string", // Note: Same as "connection" header
			"x-uidh": "string",
			"x-csrf-token": "string",

			// Note: Custom Woorank tracking / information-passing header (mirror log fields)
			// (Could be a security issue if the header is reflected in certain error pages)
			"x-woorank-id": "string",
			// Note: These are actually not strictly necessary since you could find
			// the information in the request with the id of equal to the x-woorank-id
			// header value. But since ElasticSearch doesn't let you do joins
			// (only aggregations), it could be interesting to search for tuples of:
			// (app.name, request.headers.x-woorank-app-name)
			"x-woorank-app-name": "string",
			"x-woorank-app-version": "string",
			"x-woorank-app-build": "string",
			"x-woorank-app-command": "string",
			"x-woorank-app-environement": "string"
		},
		"actualContentLength": "number",
		"actualContentLength": "number",
		// Note: Serves as a dump for non-indexed request-related key / values
		"custom": "object"
	},
	"response": {
		// Note: If the log originates from the client that made the request
		"isOrigin": "boolean",
		// Note: IPv4 address of the server making the response
		"address": "string",
		// Note: TCP port of the server making the request
		"port": "number", // Note: Not really useful imo
		"status": "number",
		"headers": {
			// Note: Response headers
			"age": "string",
			"public": "string",
			"retry-after": "string",
			"server": "string",
			"title": "string",
			"warning": "string",
			"access-control-allow-origin": "string", // Note: CORS policy
			"access-patch": "string", // Note: check RFC
			"alt-svc": "string", // Note: check RFC
			"content-disposition": "string", // Note: check RFC
			"link": "string", // Note: check RFC
			"p3p": "string", // Note: check RFC
			"public-key-pins": "string", // Note: check RFC
			"refresh": "string", // Note: check RFC
			"status": "string", // Note: check RFC
			"strict-transport-security": "string", // Note: check RFC
			"tsv": "string", // Note: check RFC

			// Note: Negotation headers
			"accept-ranges": "string",
			"vary": "string",

			// Note: Response security headers
			"proxy-authenticate": "string",
			"set-cookie": "string",
			"set-cookie2": "string",
			"www-authenticate": "string",

			// Note: Entity headers
			"allow": "string",
			"location": "string",

			// Note: Content headers
			"content-base": "string",
			"content-encoding": "string",
			"content-language": "string",
			"content-length": "number",
			"content-location": "string",
			"content-md5": "string",
			"content-range": "string",
			"content-type": "string",

			// Note: Entity caching headers
			"etag": "string",
			"expires": "string",
			"last-modified": "string",

			// Note: HTTP non-standard extension (X-) headers
			"x-frame-options": "string",
			"x-xss-protection-options": "string",
			"x-content-security-policy": "string",
			"x-webkit-csp": "string",
			"x-content-type-options": "string",
			"x-powered-by": "string",
			"x-ua-compatible": "string",
			"x-content-duration": "string",
			"upgrade-insecure-requests": "string",
		},
		"actualContentLength": "number",
		"time": "number",
		// Note: Serves as a dump for non-indexed response-related key / values
		"custom": "object"
	},

	"error": {
		"code": "string", // Note: Could be useful for Node.js native errors like Zlib
		"type": "string",
		"message": "string",
		"stack": "stack",
		// Note: Serves as a dump for non-indexed error-related key / values
		"custom": "object"
	},

	// Note: Number of redirections
	// (Ideally each intermediary request should be logged but request doesn't give you this option)
	"redirections": "number",

	// Note: Number of retries
	"retries": "number",

	// Note: Serves as a dump for non-indexed key / values
	"custom": "object"
}
```
