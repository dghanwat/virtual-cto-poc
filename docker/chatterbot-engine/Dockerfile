#
# Creates a docker container for Chatter Bot
#

ARG DOCKERREPO=docker.io
FROM alpine:edge

ENV APP_HOME /var/chatterbot-engine/

RUN apk update && apk add python py2-pip && apk add --no-cache bash git openssh
RUN pip install pip --upgrade --user
RUN pip install chatterbot
RUN pip install pika
RUN pip install pymongo
RUN pip install git+git://github.com/google/chatbase-python.git
RUN apk add --no-cache bash


# Create a user to run the app
RUN addgroup -S virtual_cto && adduser -S virtual_cto -G virtual_cto

ADD --chown=virtual_cto:virtual_cto ./app/ ${APP_HOME}app/
RUN ls -ltr ${APP_HOME}/app

ENV RABBITMQ_USER=admin
ENV RABBITMQ_PASSWORD=rabbitmqadmin
ENV RABBITMQ_SERVER=192.168.99.100
ENV RABBITMQ_PORT=5672
ENV RABBITMQ_EXCHANGE=bot_response_exchange
ENV RABBITMQ_VIRTUALHOST=/
ENV RABBITMQ_BOT_INCOMING_QUEUE=bot_request_queue
ENV MONGODB_SERVER=192.168.99.100
ENV MONGODB_USER=devroot
ENV MONGODB_PASSWORD=devroot
ENV MONGODB_PORT=27017
ENV NOTIFY_EXCHANGE=notification_exchange
ENV CHAT_BASE_API_KEY=d57b42e4-d3b9-468d-b698-dbc1c106e76b



WORKDIR ${APP_HOME}app/

# USER virtual_cto

CMD python main.py
