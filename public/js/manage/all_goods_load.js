
import Helper from '../helper.js';

import ModalGoodsToAdd from './add_or_delete_action.js';
import ChangeStatus from './privat_change_status_order.js';
import Templates from './templates.js';

class AsyncLoadFromAnouterResourse extends Helper {
	constructor(el){
		super();
		if(!el) return;
		this.offsetStart = 0;
		this.offsetEnd = 20;
		this.action = el.getAttribute('data-template');
		this.templates = Templates[this.action]();


		this.mainblockTmp = el;
		this.url = el.getAttribute('data-load');
		this.viewElement = el.querySelector('view');
		this.status = true;
		this.searchButton = document.querySelector('#a-search-admin');
		this.searchSelect = document.querySelector('#a-search-admin__select');
		this.scrollEvent = this.handlerScroll.bind(this);

		this.flyEvent('add', ['scroll'], [window], this.scrollEvent);
		this.flyEvent('add', ['keyup'], [this.searchButton], this.handlerToSearch.bind(this));

		if(this.searchSelect){
			this.flyEvent('add', ['change'], [this.searchSelect], this.handlerToSearchFilters.bind(this));
		}

		this.tryXHR();

	}

	handlerScroll(){
		if((this.viewElement.clientHeight - document.body.scrollTop) < 1000 && this.status){
			
			if(this.valueSearch && this.valueSearch != '' && this.valueSearchSelect){
				this.tryXHR('&searhByTitle='+this.valueSearch+'&searhByStatus='+this.valueSearchSelect);
			} else if(this.valueSearch && this.valueSearch != ''){
				this.tryXHR('&searhByTitle='+this.valueSearch);
			} else if (this.valueSearchSelect) {
				this.tryXHR('&searhByStatus='+this.valueSearchSelect);
			} else {
				this.tryXHR();
			}		
		}
	}


	tryXHR(urls, clear){
		this.status = false;
		let search = urls || '';
		let url = this.url+"?start="+this.offsetStart+"&end="+this.offsetEnd+search;
		this.xhrRequest("GET", url, null, null, this.responseFromServerGoodsItems.bind(this, clear), this);

	}

	handlerToSearch(){
		if(event && event.keyCode == 13){
			this.offsetStart = 0;
			this.offsetEnd = 30;
			this.valueSearch = encodeURIComponent(event.target.value);
			this.tryXHR('&searhByTitle='+this.valueSearch, 'clear');
		}
	}


	handlerToSearchFilters(event){
		if(!event && !event.target) return;

		this.valueSearchSelect = event.target.value;
		this.offsetStart = 0;
		this.offsetEnd = 30;

		this.tryXHR('&searhByStatus='+this.valueSearchSelect, 'clear');	

	}

	responseFromServerGoodsItems(clear, el){

		let tmp = "",
			obj = (JSON.parse(el)).goods || null;


		if(!obj || obj.length == 0){
			this.flyEvent('remove', ['scroll'], [window], this.scrollEvent);
			return;
		}

		if(this.action == 'orders'){
			for (var i of obj) {
				tmp += this.templates(
						i
						);
			}
		} else {
			for (var i of obj) {
				tmp += this.templates(
						i._id,
						i.img || i.src, 
						i.title, 
						i.description,
						i.size, 
						i.color, 
						i.Material || i.material, 
						i.Sostav || i.consistOf,
						i.countInWarehouse,
						i.priority,
						i.PriceRoz || i.price,
						i.auctionPrice,
						i.artikul || i.art,
						i.unsoldCount || 0
						);
			}
		}


		if(clear){
			this.viewElement.innerHTML = "";
		}

		this.viewElement.insertAdjacentHTML('beforeend', tmp);

		if(this.action != 'orders' && !window.globalRegistredModules['ModalGoodsToAdd']){
			window.globalRegistredModules['ModalGoodsToAdd'] = true;
			new ModalGoodsToAdd(this.viewElement);
		} else if(this.action == 'orders' && !window.globalRegistredModules['ChangeStatus']) {
			window.globalRegistredModules['ChangeStatus'] = true;
			new ChangeStatus(this.viewElement);
		}
		

		this.offsetStart = parseInt((JSON.parse(el)).offset);
		this.offsetEnd = this.offsetStart + 20;
		this.status = true;
		
	}

}

export default AsyncLoadFromAnouterResourse;