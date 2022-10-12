# syntax = docker/dockerfile-upstream:master-labs
FROM rust:latest

WORKDIR /usr/src/wordle-mpc-server
COPY . .
RUN cargo install --path .

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000
EXPOSE 8000
CMD ["m1-wordle"]
