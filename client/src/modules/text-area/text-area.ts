import textAreaHTML from './text-area.html';
import { send } from '../websocket';
import { user } from '../users';

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    send({ type: 'message', payload: { text: this.value, perf: performance.now() } });
    this.value = '';
  }
}

function sendStopWriting() {
  // console.log('sendStopWriting');
  if (!user.writing) return;

  send({ type: 'stopWriting', payload: {} });
  setTimeout(() => {
    sendStopWriting();
  }, 500);
}

function sendWriting() {
  // console.log('sendWriting');
  if (user.writing) return;

  send({ type: 'writing', payload: {} });
  setTimeout(() => {
    sendWriting();
  }, 500);
}

function onKeyup(this: HTMLInputElement) {
  if (this.value == '') {
    sendStopWriting();
  } else {
    sendWriting();
  }
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
  document.getElementById('text-area-input').addEventListener('keyup', onKeyup);
}
