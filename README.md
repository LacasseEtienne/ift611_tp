# IFT611_TP

## Description

This project was made in the course of IFT611.

It is divided in 3 parts:
1. [Websocket server](#server)
2. [Cassandra DB](#cassandra-db)
3. [Client](#client)

## Server
The server reside in the **npm-server** folder.

The [documentation](/npm-server/README.md) of this part is in the folder.

Please note that the **server** folder is an echo Websocket server written in C++ and using the [Boost](https://www.boost.org) librairies and based on [websocket_server_async.cpp](https://www.boost.org/doc/libs/develop/libs/beast/example/websocket/server/async/websocket_server_async.cpp). We started with it, but we change for a [Node.js](https://nodejs.org/en/) server, because Cassandra's client drivers for C++ were causing a lot of issues.
## Cassandra DB
The DB reside in the **bd** folder.

The [documentation](/bd/README.md) of this part is in the folder.

## Client
The client reside in the **client** folder.

The [documentation](/client/README.md) of this part is in the folder.