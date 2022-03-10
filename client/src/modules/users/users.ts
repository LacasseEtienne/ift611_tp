import usersHtml from './users.html';

export function loadUsers(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', usersHtml);
}
