FROM rust:latest

WORKDIR /usr/src/wordle-mpc-server

COPY . .

RUN cargo install --path .

CMD ["cargo", "run"]
