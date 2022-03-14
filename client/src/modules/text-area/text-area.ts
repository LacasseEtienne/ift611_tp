import textAreaHTML from './text-area.html';
import { socket } from '../websocket';

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    socket.send(JSON.stringify({ type: 'message', text: this.value, perf: performance.now() }));
    this.value = '';
  }
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
}
