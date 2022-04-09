import './index.scss';
import { loadChat, loadAuth, loadUsers, loadLoading, socket } from './modules'

const mainContainer = document.getElementById('main-container');
loadLoading(mainContainer);



socket.addEventListener('open', function () { loadAuth(mainContainer) });
socket.addEventListener('message', function (event) {
  const { type } = JSON.parse(event.data);
  if (type !== 'init') return;
  loadChat(mainContainer);
  loadUsers(mainContainer);
});
