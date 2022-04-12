import { My_ws } from "../types";
import WebSocket from 'ws';
import { v4 as uuidv4 } from 'uuid';
import { getLastMessages, insertIntoMessages, updateMessageDelayExceeded } from "../../db";
import { broadcastMessage, broadcastUpdateUsers, broadcastWritingUsers } from "../broadcast";
import { clients } from "../../client";
import { sendToClient } from "./communication";
import { consoleColors } from "../../util";

function getObjectFromJsonData(data: WebSocket.RawData) {
    return JSON.parse(data.toString())
}

function handleConnect(ws: My_ws, { name, perf }: { name: string, perf: number }) {
    clients[ws.clientId] = {
        ...clients[ws.clientId],
        name: name,
        connected: true,
        perf,
    };
    sendToClient(ws, { type: 'init', payload: { uuid: ws.clientId } });
    broadcastUpdateUsers();
}

function handleNewMessage(ws: My_ws, { text, perf }: { text: string, perf: number }) {
    const { name } = clients[ws.clientId];
    const messageID = uuidv4();
    const messageTime = Date.now();

    insertIntoMessages(messageID, messageTime, name, text);
    broadcastMessage(name, messageID, perf, text, messageTime, ws.clientId);
}

function handleWriting(ws: My_ws) {
    clients[ws.clientId].writing = true;
    broadcastWritingUsers();
}

function handleStopWriting(ws: My_ws) {
    clients[ws.clientId].writing = false;
    broadcastWritingUsers();
}

function handleMessageDelayExceeded(_: My_ws, { messageId, messageTime }: { messageId: string, messageTime: number }) {
    updateMessageDelayExceeded(messageId, messageTime).then(() => {
        getLastMessages(100).then(messages => {
            const numberOfMessagesDelayExceeded = messages.rows.filter(m => m.delay_exceeded).length;
            const percentOfMessagesWhoExceeded = numberOfMessagesDelayExceeded / messages.rows.length;
            if (percentOfMessagesWhoExceeded <= 0.05) return;
            console.error(`${consoleColors.red}
            ${numberOfMessagesDelayExceeded} messages out of
            ${messages.rows.length}
            exceed delay.
            ${consoleColors.reset}`);
        });
    });
}

const payloadHandler: {
    [key: string]: (ws: My_ws, payload: unknown) => void
} = {
    'connect': handleConnect,
    'message': handleNewMessage,
    'writing': handleWriting,
    'stopWriting': handleStopWriting,
    'messageDelayExceeded': handleMessageDelayExceeded,
};

export function handleMessage(ws: My_ws) {
    ws.on('message', (data) => {
        const { type, payload } = getObjectFromJsonData(data);
        if (!(type in payloadHandler)) return;
        payloadHandler[type](ws, payload);
    });
}
