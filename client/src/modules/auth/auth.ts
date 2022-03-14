import authHTML from './auth.html';
import { user } from '../users';

function handleOnClick() {
  user.name = (<HTMLInputElement>document.getElementById('auth-input')).value;
  user.connect();
}

export function loadAuth(parent: HTMLElement) {
  parent.innerHTML = authHTML;
  document.getElementById('auth-connect-btn').addEventListener('click', handleOnClick);
}
