FROM node:14.4-alpine

RUN addgroup sl \
	&& adduser -S -D -h /opt/app -s /bin/false sl

RUN apk add --quiet --update python3 build-base

WORKDIR /opt/app
USER sl

COPY ./package.json /opt/app/package.json

RUN npm install --quiet

COPY ./lib /opt/app/lib
COPY ./test /opt/app/test

CMD [ "npm", "test" ]
