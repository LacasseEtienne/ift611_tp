import WebSocket from 'ws';

export function sendToClient(ws: WebSocket.WebSocket, message: { type: string, payload: unknown }) {
    ws.send(JSON.stringify(message));
}
