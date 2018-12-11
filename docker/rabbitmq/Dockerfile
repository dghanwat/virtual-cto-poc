#
# Creates a docker container for RabbitMQ
#

ARG DOCKERREPO=docker.io
FROM $DOCKERREPO/rabbitmq:3.6.12-management

#USER rabbitmq

ADD rabbitmq.config /etc/rabbitmq/
ADD definitions.json /etc/rabbitmq/

RUN chown rabbitmq:rabbitmq /etc/rabbitmq/rabbitmq.config /etc/rabbitmq/definitions.json

# Change the default admin password
ENV RABBITMQ_DEFAULT_USER admin
ENV RABBITMQ_DEFAULT_PASS rabbitmqadmin

# Change cookie for clustering
ENV RABBITMQ_ERLANG_COOKIE jgw9prngyyew0fjs809ug980syug89shg89ys80a9gya098gs7dy09y

CMD ["rabbitmq-server"]