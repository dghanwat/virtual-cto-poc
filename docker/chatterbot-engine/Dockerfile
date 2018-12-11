#
# Creates a docker container for Chatter Bot
#

ARG DOCKERREPO=docker.io
FROM alpine:edge

ENV APP_HOME /var/chatterbot-engine/

RUN apk update && apk add python py2-pip
RUN pip install pip --upgrade --user
RUN pip install chatterbot
RUN pip install pika

# Create a user to run the app
RUN addgroup -S virtual_cto && adduser -S virtual_cto -G virtual_cto

ADD --chown=virtual_cto:virtual_cto app ${APP_HOME}app/

ENV RABBITMQ_USER=admin
ENV RABBITMQ_PASSWORD=rabbitmqadmin
ENV RABBITMQ_SERVER=192.168.99.100
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_EXCHANGE=bot_response_exchange
ENV RABBITMQ_VIRTUALHOST=/


WORKDIR ${APP_HOME}

# USER virtual_cto

CMD python ${APP_HOME}app/hello.py

