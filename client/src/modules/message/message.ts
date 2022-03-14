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
    const { type, user: sender, text, perf } = JSON.parse(event.data);
    type === 'message' && appendMessage(createMessage(sender, text), container, containerEnd);
    user.uuid === sender && checkPerf(perf);
  });
}
