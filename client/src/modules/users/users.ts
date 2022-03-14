import usersHtml from './users.html';
import { v4 as uuidv4 } from 'uuid';
import { socket } from '../websocket';

function connect(this: typeof user) {
  socket.send(JSON.stringify({ type: 'connect', user: this.uuid }));
}

export const user = {
  uuid: uuidv4(),
  connect,
};

export function loadUsers(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', usersHtml);
}
