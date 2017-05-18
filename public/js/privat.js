import Helper from './helper.js';

class Privat extends Helper {
	constructor(el) {
		super();
		if(!el) return;

		this.button = el;
		this.status = true;
		this.form = document.querySelector('.a-data-order');
		this.formToOrder = document.querySelector('.a-form-submit-order');
		this.sendButton = document.querySelector('.a-data-order-send');

		this.flyEvent('add', ['click'], [this.button], [this.openForm.bind(this)]);
		this.flyEvent('add', ['submit'], [this.formToOrder], this.sendForm.bind(this));
	}

	openForm(event){

		if(!event && !event.target) return;

		$app.modalOpen({attr: 'order'});

	}

	sendForm(event){

		event.preventDefault();

		if(!this.status) return;

		this.status = false;

		let parentForm = event && event.target || null,
			data = {};

		if(!parentForm) return;

		let elementsUserData = parentForm.elements,
			dataGoods = this.returnsDataObjectGoods(this.form.elements);

		data.goods = dataGoods.goods;
		data.priceCommon = dataGoods.priceCommon;

		for (var i = 0; i < elementsUserData.length; i++) {
			if(elementsUserData[i].type == 'text' || elementsUserData[i].tagName == "SELECT"){
				data[elementsUserData[i].name] = encodeURIComponent(elementsUserData[i].value);
			}
		}	

		data.date = new Date();
		data.status = 0;

		this.xhrRequest('POST', '/orderCreate', 'application/json', JSON.stringify(data), this.afterResponse.bind(this, parentForm));


	}

	afterResponse(form, obj){

		try {
			let object = JSON.parse(obj);
			if(object.status == 200){
				location.reload();
			} else if(object.status == 500 && object.msg) {
				if(typeof object.msg == 'string'){

					form.insertAdjacentHTML('beforeend', '<p class="a-notify">'+object.msg+'</p>');
				} else {
					throw object.msg;
				}	
			} else {
				form.insertAdjacentHTML('beforeend', '<p class="a-notify">Произошла ошибка, попробуйте позже!</p>');
			}
		} catch(e){
			form.insertAdjacentHTML('beforeend', '<p class="a-notify">'+e+'</p>');
		}

		this.status = true;

	}

	returnsDataObjectGoods(elems){

		let goods = {},
			priceCommon = 0;

		for (var i = 0; i < elems.length; i++) {
			priceCommon += parseInt(elems[i].getAttribute('data-price'));
			goods[i] = {
				id: elems[i].getAttribute('data-id'),
				count: elems[i].getAttribute('data-count'),
				price: elems[i].getAttribute('data-price'),
				title: elems[i].getAttribute('data-title'),
				size: elems[i].getAttribute('data-size'),
				image: elems[i].getAttribute('data-image'),
				color: elems[i].getAttribute('data-color'),
				art: elems[i].getAttribute('data-art')
			}
		}

		return {priceCommon: priceCommon, goods: goods};

	}

}

export default Privat;