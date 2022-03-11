import messageHTML from './message.html';

function createMessage(user: string, date: Date, message: string): Node {
  const node = document.createRange().createContextualFragment(messageHTML);
  node.getElementById('user').insertAdjacentText('beforeend', user);
  node.getElementById('date').insertAdjacentText('beforeend', date.toLocaleDateString());
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
  for (let i = 0; i < 11; i++) {
    setTimeout(() => {
      appendMessage(createMessage(`user ${i}`, new Date(), `hello ${i}`), container, containerEnd);
    }, 3000 * i);
  }
}
