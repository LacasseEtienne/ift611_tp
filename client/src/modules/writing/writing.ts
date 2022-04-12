import writingHtml from './writing.html';
import { socket } from '../websocket';
import { user } from '../users';

function generateWritingMessage(writingUsers: string[]) {
    const otherUsers = writingUsers.filter(u => u !== user.name);
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

function handleUpdateWriting(writingUsers: string[]) {
    showWritingMessage(generateWritingMessage(writingUsers));
    user.writing = writingUsers.includes(user.name);
}

export function loadWriting(parent: HTMLElement) {
    parent.insertAdjacentHTML('beforeend', writingHtml);
    socket.addEventListener('message', function (event) {
        const { type, payload } = JSON.parse(event.data);
        type === 'updateWriting' && handleUpdateWriting(payload.writingUsers);
    });
}

function showWritingMessage(message: string) {
    const writing = document.getElementById('writing');
    if (!writing) return;
    writing.innerText = message;
}