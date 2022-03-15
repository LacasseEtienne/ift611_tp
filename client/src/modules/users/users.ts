import usersHtml from './users.html';
import { socket } from '../websocket';

function connect(this: typeof user) {
  socket.addEventListener('message', function (event) {
    const { type, users } = JSON.parse(event.data);
    type === 'updateUsers' && user.uuid && replaceUsers(users);
  });
  socket.send(JSON.stringify({ type: 'connect', user: this.name }));
}

socket.addEventListener('message', function (event) {
  const { type, uuid, users } = JSON.parse(event.data);
  if (type !== 'init') return;
  user.uuid = uuid;
  replaceUsers(users);
});

function replaceUsers(users: string[]) {
  const aside = document.getElementById("users");
  if (!aside) return;
  const ul = document.createElement("ul");
  users.forEach(user => {
    ul.append(createUser(user));
  })
  aside.replaceChildren(ul);
}

function createUser(userName: string): Node {
  const li = document.createElement("li");
  li.appendChild(document.createTextNode(userName));
  if (userName === user.name) {
    li.classList.add("me");
  }
  return li;
}

export const user = {
  name: '',
  uuid: '',
  connect,
};

export function loadUsers(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', usersHtml);
}
