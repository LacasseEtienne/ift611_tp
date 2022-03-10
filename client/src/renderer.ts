import './index.scss';
import { loadChat, loadUsers } from './modules'

const mainContainer = document.getElementById('main-container');
loadChat(mainContainer);
loadUsers(mainContainer);
