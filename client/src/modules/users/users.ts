import usersHtml from './users.html';
import { send, socket } from '../websocket';

type UserInfo = {
  uuid: string;
  name: string;
  connected: boolean;
  writing: boolean;
  perf: number;
};

function connect(this: typeof user) {
  socket.addEventListener('message', function (event) {
    const { type, payload } = JSON.parse(event.data);
    type === 'updateUsers' && replaceUsers(payload.users);
  });
  function checkConnectionPerf(event: MessageEvent<any>) {
    const { type, payload } = JSON.parse(event.data);
    if (type !== 'updateUsers') return;
    if (payload.users.find((u: UserInfo) => u.uuid === user.uuid)) {

      socket.removeEventListener('message', checkConnectionPerf);
    }
    socket.addEventListener('message', checkConnectionPerf);
    send({ type: 'connect', payload: { name: this.name, perf: performance.now() } });
  }

  socket.addEventListener('message', function (event) {
    const { type, payload } = JSON.parse(event.data);
    if (type !== 'init') return;
    user.uuid = payload.uuid;
  });

  function replaceUsers(users: UserInfo[]) {
    const aside = document.getElementById("users");
    if (!aside) return;
    const ul = document.createElement("ul");
    users.forEach(user => {
      ul.append(createUser(user.name));
    });
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
    writing: false,
    connect,
  };

  export function loadUsers(parent: HTMLElement) {
    parent.insertAdjacentHTML('beforeend', usersHtml);
  }
