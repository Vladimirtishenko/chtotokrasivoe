import Helper from '../helper.js';
import ErrorCode from '../error.js';
let io = require('socket.io-client');

class AuctionReload extends Helper {
	constructor(elem){
		super();
		if(!elem) return;

		this.button = elem;
		this.socket = io();
		this.status = true;

		this.socket.on('serverMessage',(mess) =>
		{
			console.log(mess);
			if(mess && mess.action == 'reloadAuction'){
				this.status = true;
				this.button.classList.remove('a-hidden-diabled');
			}
		});

		this.flyEvent('add', ['click'], [this.button], this.clickToReload.bind(this));
	}

	clickToReload(event){
		if(event && this.status){
			this.button.classList.add('a-hidden-diabled');
			this.status = false;
			this.xhrRequest('GET', '/page_hidden_get_date', null, null, this.responseDate.bind(this))
		}
	}

	responseDate(obj){

	 	try{
	 		let date = JSON.parse(obj);

	 		if(date){
	 			this.socket.emit('reloadAuction', {});
	 		}

	 	} catch(e){
	 		this.status = true;
	 	}

	}


}

export default AuctionReload; 
