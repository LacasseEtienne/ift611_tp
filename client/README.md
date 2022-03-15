# Client

This is a simple client made with [Electron](https://www.electronjs.org). 

The client connects to the WebSocket server on `127.0.0.1:8080`.
It allows you to choose your username then you will be redirected to the chat page where you can see who's connected and chat with them.

## Prerequisites
You need to install [Node.js](https://nodejs.org/en/download/).
We recommend that you use the latest `LTS` version available.

The [server](../npm-server/) must be running before you start the client.

## Pull depenencies
```zsh
npm install
```
## Run app in dev
```zsh
npm start
```
## Package and distribute
```zsh
npm run make
```
Electron Forge creates the **out** folder where your package will be located

# Running multiple clients on a local machine

The projet does not natively support multiple clients on a single computer, but it is possible to achieve this by copying the client folder in another location, accessing the package.json file, changing the port parameter value to 3001 and the loggerPort parameter value to 9001, and starting the app from the copied directory location.