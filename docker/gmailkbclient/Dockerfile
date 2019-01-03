#
# Creates a docker container for Ingestion Service Bot
#

ARG DOCKERREPO=docker.io
FROM alpine:edge

ENV APP_HOME /var/gmail-kb-client/

RUN apk update && apk add python py2-pip
RUN apk add --no-cache bash

RUN pip install pip --upgrade --user
RUN pip install pika

# Create a user to run the app
RUN addgroup -S virtual_cto && adduser -S virtual_cto -G virtual_cto

ADD --chown=virtual_cto:virtual_cto ./app/ ${APP_HOME}app/
RUN ls -ltr ${APP_HOME}/app

ENV GMAIL_USER=lord.lewin.test@gmail.com
ENV GMAIL_PASSWORD=Atos@1234
ENV RABBITMQ_USER=admin
ENV RABBITMQ_PASSWORD=rabbitmqadmin
ENV RABBITMQ_SERVER=192.168.99.100
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_EXCHANGE=ingestion_exchange
ENV RABBITMQ_VIRTUALHOST=/
ENV RABBITMQ_BOT_INCOMING_QUEUE=ingestion_queue


WORKDIR ${APP_HOME}app/

# USER virtual_cto

CMD python main.py

