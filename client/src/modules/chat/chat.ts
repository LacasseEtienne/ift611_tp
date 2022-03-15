import chatHTML from './chat.html';
import { getMessages } from '../message';
import { loadTextArea } from '../text-area';
import { loadWriting } from '../writing';

export function loadChat(parent: HTMLElement) {
  parent.innerHTML = chatHTML;

  getMessages(document.getElementById('chat-messages'), document.getElementById('chat-messages-end'));
  loadTextArea(document.getElementById('text-area'));
  loadWriting(document.getElementById('writing-notice-area'));
}
