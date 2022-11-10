# syntax = docker/dockerfile-upstream:master-labs
FROM rust:latest

WORKDIR /usr/src/encryptle
COPY . .
RUN cargo install --path .

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000
EXPOSE 8000
CMD ["encryptle"]
