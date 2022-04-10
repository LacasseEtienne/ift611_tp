import WebSocket from 'ws';

export type My_ws = WebSocket.WebSocket & { uuid: string, clientId: string };
