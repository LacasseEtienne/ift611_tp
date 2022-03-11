import messageHTML from './message.html';

function createMessage(user: string, date: Date, message: string): Node {
  const node = document.createRange().createContextualFragment(messageHTML);
  node.getElementById('user').insertAdjacentText('beforeend', user);
  node.getElementById('date').insertAdjacentText('beforeend', date.toLocaleDateString());
  node.getElementById('message').insertAdjacentText('beforeend', message);

  return node;
}

export function getMessages(parent: HTMLElement) {
  for (let i = 0; i < 11; i++) {
    parent.appendChild(createMessage(`user ${i}`, new Date(), `hello ${i}`));
  }
}
