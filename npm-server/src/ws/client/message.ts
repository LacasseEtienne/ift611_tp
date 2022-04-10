import { My_ws } from "../types";
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { insertIntoMessages } from "../../db";
import { broadcastMessage, broadcastUpdateUsers, broadcastWritingUsers } from "../broadcast";
import { clients } from "../../client";

function getObjectFromJsonData(data: WebSocket.RawData) {
    return JSON.parse(data.toString())
}

function handleConnect(ws: My_ws, payload: { user: string }) {
    clients[ws.clientId] = {
        ...clients[ws.clientId],
        name: payload.user,
        connected: true,
    };
    ws.send(JSON.stringify({ type: 'init', uuid: ws.clientId }));
    broadcastUpdateUsers();
}

function handleNewMessage(ws: My_ws, payload: { text: string, perf: number }) {
    const { text, perf } = payload;
    const { name } = clients[ws.clientId];
    const messageID = uuidv4();
    const messageTime = Date.now();

    insertIntoMessages(messageID, messageTime, name, text);
    broadcastMessage(name, messageID, perf, text, messageTime, ws.uuid);
}

function handleWriting(ws: My_ws) {
    clients[ws.clientId].writing = true;
    broadcastWritingUsers();
}

function handleStopWriting(ws: My_ws) {
    clients[ws.clientId].writing = false;
    broadcastWritingUsers();
}

const payloadHandler: {
    [key: string]: (ws: My_ws, payload: any) => void
} = {
    'connect': handleConnect,
    'message': handleNewMessage,
    'writing': handleWriting,
    'stopWriting': handleStopWriting,
};

export function handleMessage(ws: My_ws) {
    ws.on('message', (data) => {
        const payload: { type?: string } = getObjectFromJsonData(data);
        if (!payload.type) return;
        payloadHandler[payload.type](ws, payload);
    });
}
