import Helper from '../helper.js';

class ModalGoodsToAdd extends Helper {
	constructor(elem){
		super();
		if(!elem) return;
		this.modalAddGoods = document.querySelector('.a-conteiner-flexible-fixed');
		this.closeModal = document.querySelector('.a-modal-close');

		this.flyEvent('add', ['click'], [elem, this.closeModal], [this.handlerToGoods.bind(this), this.handlerToCloseGoods.bind(this)]);
	}

	handlerToGoods(event){
		let target = event && event.target;
			


			if(target.classList.contains('a-delete-this-item-with-id')){
				this.handlerToDeleteGoods(target)
			} else if((target.classList.contains('a-all-goods-table__item')))	{
				this.handlerToAddGoods(target)
			}	else if(target.closest('.a-all-goods-table__item')){
				this.handlerToAddGoods(target.closest('.a-all-goods-table__item'))
			}	else {
				return;
			}	 

	}

	handlerToAddGoods(elementToCheck){

		let form = elementToCheck.querySelector('.a-hidden-form').cloneNode(true);

		this.flyEvent('add', ['submit'], [form], [this.handlerToAddGoodsValidation.bind(this)]);

		this.modalAddGoods.appendChild(form);

		this.cssHelper([this.modalAddGoods], ["right: 0%"]);


		this.animationEndEvent = this.animationEnd.bind(this);
	}


	handlerToDeleteGoods(target){

		let _id = {
			_id: target.getAttribute('data-id')
		} 

		if(!_id._id) return;

		this.xhrRequest("DELETE", '/allGoods', 'application/json; charset=utf-8', JSON.stringify(_id), this.handlerToResponseBeforeDelete.bind(this, target))
		
	}

	handlerToCloseGoods(){
		this.flyEvent('add', ['transitionend'], [this.modalAddGoods], [this.animationEndEvent])
		this.cssHelper([this.modalAddGoods], ["right: 100%"]);
		
	}

	animationEnd(){
		this.modalAddGoods.removeChild(this.modalAddGoods.lastElementChild);
		this.flyEvent('remove', ['transitionend'], [this.modalAddGoods], [this.animationEndEvent])
	}

	handlerToAddGoodsValidation(event){
		event.preventDefault();
		let form = event && event.target,
			elementsCheckbox = form.querySelectorAll('input[type="checkbox"]'),
			elementsAllWithoutCheckbox = form.querySelectorAll('input[type="hidden"], input[type="text"]'),
			data = [];

			for (var i = 0; i < elementsCheckbox.length; i++) {

				if(elementsCheckbox[i].checked && elementsCheckbox[i].name == "size"){
					let warehouse = elementsCheckbox[i].parentNode.querySelector('[data-label-count="'+elementsCheckbox[i].value+'"]');
					data.push(helpToValidate(elementsCheckbox[i], warehouse));
				}

				if(elementsCheckbox[i].name == "priority"){
					data.push(helpToValidate(elementsCheckbox[i]));
				}
				
			}


		function  helpToValidate(checkbox, warehouse) {
			let templateData = {};
			for (var i = 0; i < elementsAllWithoutCheckbox.length; i++) {
				templateData[elementsAllWithoutCheckbox[i].name] = encodeURIComponent(elementsAllWithoutCheckbox[i].value)
			}

			if(warehouse){
				templateData[warehouse.name] = warehouse.value;
			}

			templateData[checkbox.name] = checkbox.name == "size" ? encodeURIComponent(checkbox.value) : checkbox.checked ? true : false;

			return templateData;

		}

		this.xhrRequest("POST", '/allGoods', 'application/json; charset=utf-8', JSON.stringify(data), this.handlerToResponse.bind(this))
		
	}

	handlerToRemoveFromLayout(target){
		let parent = target.parentNode;
		parent.parentNode.removeChild(parent);
	}

	handlerToResponseBeforeDelete(target, obj){
		if(!JSON.parse(obj)) return;
		let status = (JSON.parse(obj)).status;
		if(status == 200){
			this.handlerToRemoveFromLayout(target);
		}
	}

	handlerToResponse(obj){
		if(!JSON.parse(obj)) return;
		let status = (JSON.parse(obj)).status;
		if(status == 200){
			this.handlerToCloseGoods();
		}

	}

}

export default ModalGoodsToAdd;