import textAreaHTML from './text-area.html';
import { socket } from '../websocket';
import { user } from '../users';

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    socket.send(JSON.stringify({ type: 'message', user: user.uuid, text: this.value }));
    this.value = '';
  }
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
}
