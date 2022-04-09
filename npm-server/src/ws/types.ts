import WebSocket from 'ws';

export type My_ws = WebSocket.WebSocket & { name: string, uuid: string };
