import { My_ws } from "../types";
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { insertIntoMessages } from "../../db";
import { broadcastMessage, broadcastUpdateUsers, broadcastWritingUsers } from "../broadcast";

const writingUsers: string[] = [];

function getObjectFromJsonData(data: WebSocket.RawData) {
    return JSON.parse(data.toString())
}

function handleConnect(ws: My_ws, payload: { user: string }) {
    ws.name = payload.user;
    ws.send(JSON.stringify({ type: 'init', uuid: ws.uuid }));
    broadcastUpdateUsers();
}

function handleNewMessage(ws: My_ws, payload: { text: string, perf: number }) {
    const { text, perf } = payload;
    const messageID = uuidv4();
    const messageTime = Date.now();

    insertIntoMessages(messageID, messageTime, ws.name, text);
    broadcastMessage(ws.name, messageID, perf, text, messageTime, ws.uuid);
}

function handleWriting(ws: My_ws) {
    if (writingUsers.includes(ws.name)) return;

    writingUsers.push(ws.name);
    broadcastWritingUsers(writingUsers);
}

function handleStopWriting(ws: My_ws) {
    const index = writingUsers.indexOf(ws.name);
    if (index > -1) {
        writingUsers.splice(index, 1);
        broadcastWritingUsers(writingUsers);
    }
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
