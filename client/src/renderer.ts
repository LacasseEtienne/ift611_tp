// import './index.scss';
// import { loadChat, loadUsers, loadLoading, user, socket } from './modules'

// const mainContainer = document.getElementById('main-container');
// loadLoading(mainContainer);

// socket.addEventListener('open', function () { user.connect(); });


// loadChat(mainContainer);
// loadUsers(mainContainer);





import './index.scss';
import { loadChat, loadAuth, loadUsers, loadLoading, socket } from './modules'

const mainContainer = document.getElementById('main-container');
loadLoading(mainContainer);

socket.addEventListener('open', function () { loadAuth(mainContainer) });

loadChat(mainContainer);
loadUsers(mainContainer);
