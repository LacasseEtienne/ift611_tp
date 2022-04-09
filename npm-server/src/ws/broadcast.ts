import { My_ws } from './types';
import { wss } from './server';
import { getUsers } from './user';

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
    wss.clients.forEach((connection: My_ws) => {
        connection.send(JSON.stringify({ type: 'updateUsers', users: getUsers() }));
    });
}

export function broadcastMessage(name: string, uuid: string, perf: number, text: string, messageTime: number) {
    wss.clients.forEach((connection: My_ws) => {
        connection.send(JSON.stringify({ type: 'message', name, uuid, perf, text, messageTime }));
    })
}

export function broadcastWritingUsers(writingUsers: string[]) {
    wss.clients.forEach((connection: My_ws) => {
        connection.send(JSON.stringify({
            type: 'updateWriting',
            message: generateWritingMessage(writingUsers, connection.name)
        }));
    });
}