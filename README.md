# Privacy-Preserving Wordle
Multi-Party Computation Wordle by 

<a href="https://sine.foundation" target="_blank">
  <img src="https://user-images.githubusercontent.com/100690574/198339557-0e1bb4cd-fe42-448b-a02e-561d8ef4460f.png" alt="SINE" height="20"/> 
</a>

## Description
A version of New York Times' popular game _Wordle_, using SINE's [Secure Multi-Party Computation (M1) engine](https://github.com/sine-fdn/wrk17-alpha). 

[__Play here__!](https://mpc-wordle.fly.dev)

## Concept
In the original Wordle game the player's guesses are compared to the secret word. 
Hence, although the latter is kept secret, the former are shared with the server.
This version of Wordle uses [Secure Multi-Party Computation](https://sine.foundation/library/002-smpc), 
keeping both the secret word _and the player's guesses_ private.

This project was developed to serve as a demo for SINE's M1 engine. 

## Technologies
This repository contains a backend server (henceforth, 'the server') and a frontend server (henceforth 'the client').

The server is powered by `rocket.rs` and implements SINE's M1 engine, which runs [Garble](https://github.com/sine-fdn/garble-lang) programs.

The client adapts [this repository](https://github.com/cwackerfuss/react-wordle), which uses (mainly) React and Typescript. 

## Build and run

### Run locally
Start the server by running the following commands:
```
$ cd mpc-server
$ cargo install --path . 
$ mpc-server
```

Start the client by running the following commands:
```
$ cd react-wordle
$ npm install
$ npm run start
```
Open http://localhost:3000 and play!

### Build and run Docker containers
Build and run the server using the following commands:
```
$ cd mpc-wordle
$ docker build -t mpc-server -f mpc-server/Dockerfile .
$ docker run -p 8000:8000 --name mpc-server
```

Build and run the client for __development__ using the following commands:
```
$ cd react-wordle
$ docker build -t reactle:dev .
$ docker run -p 3000:3000 --name reactle-dev reactle:dev
```
Open http://localhost:3000 and play!

Build and run the client for __production__ using the following commands:
```
$ cd react-wordle
$ docker build --target=prod -t reactle:prod .
$ docker run -p 80:8080  --name reactle-prod reactle:prod
```

## Contributions
All contributions and suggestions are welcomed! Please open issues for that effect.

