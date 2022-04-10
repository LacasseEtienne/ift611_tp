import { My_ws } from './types';
import { wss } from './server';
import { getUsersName } from './user';

function generateWritingMessage(writingUsers: string[], name: string) {
    const otherUsers = writingUsers.filter(u => u !== name);
    if (otherUsers.length == 0) {
        return "";
    } else if (otherUsers.length == 1) {
        return `${otherUsers[0]} is typing...`;
    } else if (otherUsers.length == 2) {
        return `${otherUsers[0]} and ${otherUsers[1]} are typing...`;
    } else {
        return `${otherUsers.length} people are typing...`;
    }
}

export function broadcastUpdateUsers() {
    wss.clients.forEach((client: My_ws) => {
        client.send(JSON.stringify({ type: 'updateUsers', users: getUsersName() }));
    });
}

export function broadcastMessage(name: string, uuid: string, perf: number, text: string, messageTime: number, userId: string) {
    wss.clients.forEach((client: My_ws) => {
        client.send(JSON.stringify({ type: 'message', name, uuid, perf, text, messageTime, userId }));
    })
}

export function broadcastWritingUsers(writingUsers: string[]) {
    wss.clients.forEach((client: My_ws) => {
        client.send(JSON.stringify({
            type: 'updateWriting',
            message: generateWritingMessage(writingUsers, client.name)
        }));
    });
}