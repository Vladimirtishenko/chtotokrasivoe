'use strict';
import '../../styl/manage/default_manage.styl';


import ModalGoodsToAdd from './add_or_delete_action.js';
import AsyncLoadFromAnouterResourse from './all_goods_load.js';
import Config from './config.js';
import Rules from './rules.js';
import AuctionReload from './auction_reload.js';
import User from './user_controls.js';
import OrdersDetails from './order_details.js';
import RemoveGoodsAll from './auction_goods_remove.js';

window.globalRegistredModules = {};

window.addEventListener('DOMContentLoaded', () => {
	new AsyncLoadFromAnouterResourse(document.querySelector('.a-table-admin.__a-for-goods') || document.querySelector('.a-table-admin.__a-for-auction') || document.querySelector('.a-table-admin.__a-for-orders') );
	new Config(document.querySelector('.a-table-admin.__a-for-config'));
	new Rules(document.querySelector('.a-rules-block'));
	new AuctionReload(document.querySelector('.a-reload-auction'));
	new User(document.querySelector('.che-users-view'));
	new OrdersDetails(document.querySelector('.che-items-print-controls'));
	new RemoveGoodsAll(document.querySelector('.a-fuck-auction-remove'));
})
