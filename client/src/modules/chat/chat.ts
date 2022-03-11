import chatHTML from './chat.html';
import { getMessages } from '../message'
import { loadTextArea } from '../text-area'

export function loadChat(parent: HTMLElement) {
  parent.insertAdjacentHTML('beforeend', chatHTML);

  getMessages(document.getElementById('chat-messages'));
  loadTextArea(document.getElementById('text-area'));
}
