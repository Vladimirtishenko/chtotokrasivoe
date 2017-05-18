import Helper from '../helper.js';
import Notification from './notifier.js';

class OrdersDetails extends Helper {
	constructor(el){
		super();
		this.el = el;
		this.blockForm = document.querySelector('.a-form-to-send-details');
		this.access = ['subject', 'html_msg', 'ttn', 'order', 'email', 'status', 'orderId'];
		this.Notification = new Notification();

		this.flyEvent('add', ['click'], [this.el], this.tabChange.bind(this));
		this.flyEvent('add', ['submit'], [this.blockForm], this.submitMessage.bind(this));

	}

	tabChange(event){

		if(!event || !event.target || !event.target.classList.contains('che-print-button')) return;


		let target = event.target,
			_id = target.getAttribute('data-id'),
			active = document.querySelector('.a-active-tab'),
			checked = document.querySelector('#'+_id);

			if(checked.classList.contains('a-active-tab')) return;

			checked.classList.add('a-active-tab');
			active.classList.remove('a-active-tab');

	}

	submitMessage(event){
		event.preventDefault();

		let form = event.target,
			elements = form.elements,
			id = form.id,
			data = {
				id: id
			}

		for (var i = 0; i < elements.length; i++) {
			if(this.access.indexOf(elements[i].name) != -1){
				data[elements[i].name] = elements[i].value;
			}
		}

		this.xhrRequest('POST', '/send_message', 'application/json', JSON.stringify(data), this.messageNotify.bind(this))

	}

	messageNotify(obj){

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

export default OrdersDetails;