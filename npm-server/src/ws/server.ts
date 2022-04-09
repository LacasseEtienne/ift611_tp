import { WebSocketServer } from "ws";

export const wss = new WebSocketServer({ port: 8080 });

console.log('websocket server started');
