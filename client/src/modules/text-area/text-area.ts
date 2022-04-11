import textAreaHTML from './text-area.html';
import { send } from '../websocket';

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    send({ type: 'message', payload: { text: this.value, perf: performance.now() } });
    this.value = '';
  }
}

function onKeyup(this: HTMLInputElement) {
  if (this.value == '') {
    send({ type: 'stopWriting', payload: {} });
  } else {
    send({ type: 'writing', payload: {} });
  }
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
  document.getElementById('text-area-input').addEventListener('keyup', onKeyup);
}
