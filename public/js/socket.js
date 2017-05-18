import Helper from './helper.js';
let io = require('socket.io-client');

class Sockets extends Helper {
	constructor() {
		super();
		this.socket = io();
		this.registeredCallback = {};
		//set client-server time diff
		var dateT = new Date();
		this.socket.emit('setClientTime', {time: dateT.getTime()});

		this.socket.on('serverMessage',(mess) =>
		{
			console.log(mess);
			try{
				this.registeredCallback[mess.action](mess);
			} catch(e){
				//console.log(e);
			}
		});
	}

	setRegisteredCallback(action, callback){
		this.registeredCallback[action] = callback;
	}

	getCurrentTime(action, callback){
		this.registeredCallback[action] = callback;
		this.socket.emit(action, action);
	}

	authorize(action, data, callback){

		this.setRegisteredCallback(action, callback);

		this.socket.emit(action, data);

	}

	getCurrentAuction(action, callback){


		this.setRegisteredCallback(action, callback);

		this.socket.emit('getCurrentAuction', {});

	}

	getAuctions(action, callback){

		this.setRegisteredCallback(action, callback);

		this.socket.emit('getAuctions', {});

	}

	pretendentAdded(action, callback){
		this.setRegisteredCallback(action, callback);
	}

	auctionFinished(action, callback){
		this.setRegisteredCallback(action, callback);
	}

	actionStarted(action, callback){
		this.setRegisteredCallback(action, callback);
	}

	auctionUpdated(action, callback){
		this.setRegisteredCallback(action, callback);
	}

	baseBuy(action, data, callback){
		this.setRegisteredCallback(action, callback);

		this.socket.emit(action, data);
	}

	upPrice(action, data, callback){
		this.setRegisteredCallback(action, callback);

		this.socket.emit(action, data);
	}

	upCount(action, data, callback){
		this.setRegisteredCallback(action, callback);

		this.socket.emit(action, data);
	}

	AuctionFinishedDataChanged(action, callback){
		this.setRegisteredCallback(action, callback);
		this.socket.emit(action, {});
	}


}

export default Sockets;