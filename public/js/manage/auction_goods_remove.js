import Helper from '../helper.js'
import Notification from './notifier.js'

class RemoveGoodsAll extends Helper {
	constructor(el){
		super();

		if(!el) return;

		this.el = el;
		this.Notification = new Notification();
		this.view = document.querySelector('.a-all-goods-table');

		this.flyEvent('add', ['click'], [this.el], this.removeAllHandler.bind(this));

	}

	removeAllHandler(event){

		if(!event && !event.target) return;

		let promt = prompt('Ключевое слово?');

		if(promt){
			this.xhrRequest('GET', '/remove_auction_goods?key='+promt, null, null, this.responseAfterDelete.bind(this))
		}

	}

	responseAfterDelete(obj){
		try{
			let json = JSON.parse(obj);

			if(json.status != 200){
				throw json.errorMsg;
			}

			this.Notification.errCode(json.successMsg);

			this.view.innerHTML = "";


		} catch(e){
			this.Notification.errCode(e);
		}
	}


}

export default RemoveGoodsAll;