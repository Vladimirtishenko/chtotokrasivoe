import Helper from '../helper.js'
import Notifier from './notifier.js'

class UserControls extends Helper {
	constructor(el){
		super();
		if(!el) return;

		this.flyEvent('add', ['click'], [el], this.handlerToRemove.bind(this));
		this.Notifier = new Notifier();

	}

	handlerToRemove(event){

		if(!event && !event.target && !event.target.classList.contains('che-remove-user')) return;

		let target = event.target,
			id = target.getAttribute('data-id'),
			closest = target.closest('.che-users-view__removed');
		if(confirm('Уверены?')){
			this.xhrRequest('DELETE', '/page_user', 'application/x-www-form-urlencoded', 'id='+id, this.responseHandler.bind(this, closest));
		}
		
	}

	responseHandler(closest, obj){
		try{
			let json = JSON.parse(obj);
			if(json.status != 200){
				throw json.errmsg;
			}
			closest.parentNode.removeChild(closest);
		} catch(e){
			this.Notifier.errCode(e);
		}
	}

}

export default UserControls;