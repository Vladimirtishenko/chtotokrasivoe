import Helper from '../helper.js';
import Notification from './notifier.js';

class ChangeStatus extends Helper {
	constructor(elem){
		super();
		if(!elem) return;

		this.view = elem;
		this.Notification = new Notification();
		this.savedVerify = ['_id', 'status', 'country', 'sity', 'delivery', 'warehouse'];

		this.flyEvent('add', ['click'], [this.view], this.removeItem.bind(this));
		this.flyEvent('add', ['submit'], [this.view], this.submitForm.bind(this));

	}

	removeItem(event){

		if(event && event.target && !event.target.classList.contains('a-remove-item-order')) return;

		let _id = event.target.getAttribute('data-id'),
			_number = event.target.getAttribute('data-number');
			parent = event.target.parentNode;

		this.xhrRequest('GET', '/order_one_edit?_id='+_id+"&_number="+_number, null, null, this.responseAfterDelete.bind(this, parent));

	}

	submitForm(event){
		event.preventDefault();

		let form = event.target,
			elements = form.elements,
			data = {};

			for (var i = 0; i < elements.length; i++) {
				if(this.savedVerify.indexOf(elements[i].name) != -1){
					data[elements[i].name] = elements[i].value;
				}
			}

		this.xhrRequest('POST', '/order_one_edit', 'application/json', JSON.stringify(data), this.responseAfterUpdate.bind(this));

	}

	responseAfterDelete(parent, obj){
		try{
			let json = JSON.parse(obj);

			if(json.status != 200){
				throw json.errorMsg;
			}

			let commonPrice = json.priceUpdated,
				priceCommon = document.querySelector('.a-common-price-'+json._id);

			priceCommon.innerHTML = commonPrice + "руб."
			parent.parentNode.removeChild(parent);

		} catch(e){
			this.Notification.errCode(e);
		}
	}

	responseAfterUpdate(obj){
		try{
			let json = JSON.parse(obj);

			if(json.status != 200){
				throw json.errorMsg;
			}

			this.Notification.errCode(json.successMsg);

		} catch(e){
			this.Notification.errCode(e);
		}
	}

}

export default ChangeStatus;