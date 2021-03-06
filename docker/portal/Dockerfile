#
# Creates a docker container for the Portal
#
ARG DOCKERREPO=docker.io
FROM $DOCKERREPO/centos:7
# FROM alpine:edge

RUN curl -sL https://rpm.nodesource.com/setup_9.x | bash -

RUN INSTALL_PKGS="nodejs epel-release" && \
    yum -y --setopt=tsflags=nodocs install $INSTALL_PKGS && \
    rpm -V $INSTALL_PKGS && \
    yum clean all  && \
    localedef -f UTF-8 -i en_US en_US.UTF-8


ENV APP_HOME /var/portal/

# Create a user to run the app
RUN groupadd -r portal_user -g 3001 && \
    useradd -u 3001 -r -g portal_user -m -d ${APP_HOME} -c "Run User" portal_user

# Add the build dist folder and package.json (for npm resolution)
ADD --chown=portal_user:portal_user dist ${APP_HOME}dist/
ADD --chown=portal_user:portal_user package.json ${APP_HOME}
ADD --chown=portal_user:portal_user package-lock.json ${APP_HOME}


EXPOSE 3000

ENV PORT=3000
ENV KEEP_WSS_CONNECTION_ALIVE=5000 
ENV ENVIRONMENT=localdocker

WORKDIR ${APP_HOME}
RUN npm install --registry=https://registry.npmjs.com/ --no-optional --verbonse

USER portal_user
CMD node ${APP_HOME}dist/server/app.js
