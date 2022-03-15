# Server
The server is a WebSocket server running in a [Node.js](https://nodejs.org) environment.

For Websocket, we are using [ws](https://www.npmjs.com/package/ws).

The server is setup to listen on `127.0.0.1:8080`.

## Prerequisites
You need to install [Node.js](https://nodejs.org/en/download/).
We recommend that you use the latest `LTS` version available.

The [database](../database/) must be up before starting the server.

## Install the dependencies
```shell
npm install
```

## Start the server
```shell
npm start
```