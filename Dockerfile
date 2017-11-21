FROM node:7.7.1-alpine

RUN addgroup woorank
RUN adduser -D -G woorank -g "Woorank" -s /bin/sh woorank
RUN mkdir -p /opt/app
RUN chown woorank:woorank /opt/app

WORKDIR /opt/app
USER woorank

COPY ./package.json /opt/app/package.json

RUN npm install --quiet

COPY ./lib /opt/app/lib
COPY ./test /opt/app/test

CMD [ "npm", "test" ]
