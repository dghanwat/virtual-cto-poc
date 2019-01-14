#
# Creates a docker container for Chatter Bot
#

ARG DOCKERREPO=docker.io
FROM frolvlad/alpine-glibc:alpine-3.8

ENV CONDA_DIR="/opt/conda"
ENV PATH="$CONDA_DIR/bin:$PATH"

# Install conda
RUN CONDA_VERSION="4.5.4" && \
    CONDA_MD5_CHECKSUM="a946ea1d0c4a642ddf0c3a26a18bb16d" && \
    \
    apk add --no-cache --virtual=.build-dependencies wget ca-certificates bash && \
    \
    mkdir -p "$CONDA_DIR" && \
    wget "http://repo.continuum.io/miniconda/Miniconda3-${CONDA_VERSION}-Linux-x86_64.sh" -O miniconda.sh && \
    echo "$CONDA_MD5_CHECKSUM  miniconda.sh" | md5sum -c && \
    bash miniconda.sh -f -b -p "$CONDA_DIR" && \
    echo "export PATH=$CONDA_DIR/bin:\$PATH" > /etc/profile.d/conda.sh && \
    rm miniconda.sh && \
    \
    conda update --all --yes && \
    conda config --set auto_update_conda False && \
    rm -r "$CONDA_DIR/pkgs/" && \
    \
    apk del --purge .build-dependencies && \
    \
    mkdir -p "$CONDA_DIR/locks" && \
    chmod 777 "$CONDA_DIR/locks"

ENV APP_HOME /var/chatterbot-engine/

# RUN apk update && apk add python py2-pip && apk add --no-cache bash git openssh
RUN pip install pip --upgrade --user
RUN pip install pika
RUN pip install pymongo
RUN pip install nltk
RUN pip install tensorflow
RUN pip install keras
RUN pip install numpy
RUN pip install h5py
RUN pip install matplotlib
RUN apk add --no-cache git
RUN pip install git+git://github.com/google/chatbase-python.git
RUN python -m nltk.downloader punkt
# RUN pip install pickle

RUN apk add --no-cache bash

# RUN python nltk.download('punkt')


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
