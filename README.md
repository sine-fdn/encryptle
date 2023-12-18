# Encryptle

<img src="https://user-images.githubusercontent.com/100690574/204781884-6b368168-8af9-4495-8e59-f2639623f11c.png" alt="SINE Logo" height="150" align="right"/>

Secure Multi-Party Computation word-guessing game

## Description

A version of [New York Times' popular game _Wordle_](https://www.nytimes.com/games/wordle/index.html), using SINE's [Tandem engine](https://github.com/sine-fdn/tandem).

[__Play here__!](https://encryptle.sine.dev)

## Concept

In the original Wordle game the player's guesses are compared to the secret word.
Hence, although the latter is kept secret, the former are shared with the server.
Encryptle uses [Secure Multi-Party Computation](https://sine.foundation/library/002-smpc),
keeping both the secret word _and the player's guesses_ private.

This project was developed to serve as a demo for SINE's [Tandem engine](https://github.com/sine-fdn/tandem).

## Technologies

This repository contains a backend server (henceforth, 'the server') and a frontend server (henceforth 'the client').

The server is powered by `rocket.rs` and implements SINE's tandem engine, which runs [Garble](https://github.com/sine-fdn/garble-lang) programs.

The client adapts [this repository](https://github.com/cwackerfuss/react-wordle), which uses (mainly) React and Typescript.

## Build and run

### Server

You can start the server by running the following commands:
```
$ cd server
$ cargo install --path .
$ encryptle
```

Alternatively, you can build and run a Docker container with the server using the following commands:
```
$ cd server
$ docker build -t encryptle-server -f Dockerfile .
$ docker run -p 8000:8000 --name encryptle-server
```

### Client

Build and run a Docker container with the client for __development__ using the following commands:
```
$ cd client
$ docker build -t encryptle-client:dev .
$ docker run -p 3000:3000 --name encryptle-client-dev encryptle-client:dev
```
Open http://localhost:3000 and play!

Build and run a Docker container with the client for __production__ using the following commands:
```
$ cd client
$ docker build --target=prod -t encryptle-client:prod .
$ docker run -p 80:8080  --name encryptle-client-prod encryptle-client:prod
```

## Contributions

All contributions and suggestions are welcomed! Please open issues for that effect.
