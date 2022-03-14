import usersHtml from './users.html';
import { socket } from '../websocket';

function connect(this: typeof user) {
  socket.addEventListener('message', function (event) {
    const { type, users } = JSON.parse(event.data);
    type === 'updateUsers' && replaceUsers(users);
  });
  socket.send(JSON.stringify({ type: 'connect', user: this.name }));
}

function replaceUsers(users: string[]) {
  const aside = document.getElementById("users");
  const ul = document.createElement("ul");
  users.forEach(user => {
    ul.append(createUser(user));
  })
  aside.replaceChildren(ul);
}

function createUser(user: string): Node {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(user));
  return li;
}

export const user = {
  name: '',
  connect,
};

export function loadUsers(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', usersHtml);
}
