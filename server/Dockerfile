# syntax = docker/dockerfile-upstream:master-labs
FROM rust:1.74 AS builder
WORKDIR /usr/src/encryptle
COPY . .
RUN rustup target add x86_64-unknown-linux-musl
RUN cargo install --target x86_64-unknown-linux-musl --path .

FROM alpine:3.16
COPY --from=builder /usr/local/cargo/bin/encryptle /usr/local/bin/encryptle

ENV ROCKET_ADDRESS=0.0.0.0
ENV ROCKET_PORT=8000
EXPOSE 8000
CMD ["encryptle"]
