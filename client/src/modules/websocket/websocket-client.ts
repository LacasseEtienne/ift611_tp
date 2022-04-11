export const socket = new WebSocket('ws://127.0.0.1:8080');

export function send(message: { type: string, payload: unknown }) {
    socket.send(JSON.stringify(message));
}
