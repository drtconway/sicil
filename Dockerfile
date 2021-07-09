FROM ubuntu:groovy

RUN apt update && \
    apt install -y \
        yarnpkg

