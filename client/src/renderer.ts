import './index.scss';
import { loadChat, loadUsers, user, socket } from './modules'

socket.addEventListener('open', function () { user.connect(); });

const mainContainer = document.getElementById('main-container');
loadChat(mainContainer);
loadUsers(mainContainer);
