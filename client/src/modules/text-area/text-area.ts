import textAreaHTML from './text-area.html';
const exampleSocket = new WebSocket("ws://127.0.0.1:8080");
exampleSocket.onopen = function () {
  console.log("opened");
};
exampleSocket.onmessage = function (event) {
  console.log(`received: ${event.data}`);
}

function onKeydown(this: HTMLInputElement, e: KeyboardEvent) {
  if (e.key === 'Enter') {
    console.log(`send: ${this.value}`);
    exampleSocket.send(this.value);
    this.value = '';
  }
}

export function loadTextArea(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', textAreaHTML);
  document.getElementById('text-area-input').addEventListener('keydown', onKeydown);
}
