import { wss } from './server';
import { getWritingClients, getUsersName } from '../client';

export function broadcast(message: { type: string, payload: any }) {
    const stringifiedMessage = JSON.stringify(message);
    wss.clients.forEach(client => client.send(stringifiedMessage));
}

export function broadcastUpdateUsers() {
    broadcast({
        type: 'updateUsers',
        payload: {
            users: getUsersName(),
        },
    });
}

export function broadcastMessage(name: string, uuid: string, perf: number, text: string, messageTime: number, userId: string) {
    broadcast({
        type: 'message',
        payload: {
            name,
            uuid,
            perf,
            text,
            messageTime,
            userId,
        },
    });
}

export function broadcastWritingUsers() {
    broadcast({
        type: 'updateWriting',
        payload: {
            writingUsers: getWritingClients().map(c => c.name),
        },
    });
}