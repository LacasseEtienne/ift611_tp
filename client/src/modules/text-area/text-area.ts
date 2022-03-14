import textAreaHTML from './text-area.html';
import { socket } from '../websocket';
import { user } from '../users';
import { v4 as uuidv4 } from 'uuid';

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    socket.send(JSON.stringify({ type: 'message', user: user.uuid, text: this.value, perf: performance.now() }));
    this.value = '';
  }
}

function testPerf() {
  const interval = setInterval(function () {
    socket.send(JSON.stringify({ type: 'message', user: user.uuid, text: uuidv4(), perf: performance.now() }));
  }, 50);
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
  testPerf();
}
