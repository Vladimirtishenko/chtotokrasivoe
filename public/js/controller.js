'use strict';
import '../styl/general.styl';

import Sockets from './socket.js';
import Modal from './modal.js';
import Chat from './chat.js';
import Zoom from './zoomImg.js';
import Async from './asyncLoad.js';
import AsyncAllGoods from './asyncLoadAllGoods.js';
import Timer from './timerToStart.js';
import Privat from './privat.js';
import LocalBase from './localBase.js';

window.$app = {};

$app.timeDiff = timeDiff;

window.addEventListener('DOMContentLoaded', () => {
	$app.socket = new Sockets();
	$app.local = new LocalBase();
	new Timer(document.querySelector('.a-time-to-start'));
	new Chat(document.querySelector('.a-chat-container'));
	new Modal();
	new Privat(document.querySelector('.a-button-to-submits-order'));
	new Async(document.querySelector('.__index-auction'));
	new AsyncAllGoods(document.querySelector('.a-all-goods-table'));
	new Zoom(document.querySelector('.a-zoom-container'));
})


