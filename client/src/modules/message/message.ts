import messageHTML from './message.html';
import { checkPerf } from './messagePerf';
import { socket } from '../websocket';
import { user } from '../users';

function createMessage(user: string, message: string): Node {
  const node = document.createRange().createContextualFragment(messageHTML);
  node.getElementById('user').insertAdjacentText('beforeend', user);
  node.getElementById('message').insertAdjacentText('beforeend', message);

  return node;
}

function scrollToBottomAfterDOMReload(containerEnd: HTMLElement) {
  setTimeout(() => {
    containerEnd.scrollIntoView({ behavior: "smooth" });
  }, 0);
}

function appendMessage(message: Node, container: HTMLElement, containerEnd: HTMLElement) {
  container.appendChild(message);
  scrollToBottomAfterDOMReload(containerEnd);
}


export function getMessages(container: HTMLElement, containerEnd: HTMLElement) {
  socket.addEventListener('message', function (event) {
    const { type, payload } = JSON.parse(event.data);
    if (type !== 'message') return;
    const { name, text, perf, userId, uuid, messageTime } = payload;
    appendMessage(createMessage(name, text), container, containerEnd);
    user.uuid === userId && checkPerf(perf, uuid, messageTime);
  });
}
