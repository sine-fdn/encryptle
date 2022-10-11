# syntax = docker/dockerfile-upstream:master-labs
FROM rust:latest

WORKDIR /usr/src/wordle-mpc-server
COPY . .
ADD git@github.com:sine-fdn/wrk17-alpha.git#m1-refactoring ../../wrk17-alpha
RUN cargo install --path .

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000
EXPOSE 8000
CMD ["m1-wordle"]
