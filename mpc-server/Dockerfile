# syntax = docker/dockerfile-upstream:master-labs
FROM rust:latest

WORKDIR /usr/src/wordle-mpc-server

COPY . .

ADD git@github.com:sine-fdn/wrk17-alpha.git#m1-refactoring ./wrk17-alpha

EXPOSE 8000

RUN cargo install --path .

CMD ["m1-wordle"]
