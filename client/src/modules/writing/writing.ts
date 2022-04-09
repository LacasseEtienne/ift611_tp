import writingHtml from './writing.html';
import { socket } from '../websocket';

export function loadWriting(parent: HTMLElement) {
    parent.insertAdjacentHTML('beforeend', writingHtml);
    socket.addEventListener('message', function (event) {
        const { type, message } = JSON.parse(event.data);
        type === 'updateWriting' && showWritingMessage(message);
    });
}

function showWritingMessage(message: string) {
    const writing = document.getElementById('writing');
    if (!writing) return;
    writing.innerText = message;
}