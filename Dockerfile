FROM node:7.7.1-alpine

RUN addgroup sl \
	&& adduser -S -D -h /opt/app -s /bin/false sl

WORKDIR /opt/app
USER sl

COPY ./package.json /opt/app/package.json

RUN npm install --quiet

COPY ./lib /opt/app/lib
COPY ./test /opt/app/test

CMD [ "npm", "test" ]
