import Helper from './helper.js';

class AsyncLoadAllGoods extends Helper {
	constructor(el) {
		super();
		if(!el) return;
		this.Number = 1;
		this.offset = 0;
		this.el = el;
		this.status = true;

		this.requestModule();

		this.flyEvent('add', ['scroll'], [window], this.initAsyncLoad.bind(this))
	}

	initAsyncLoad(){

		if((this.el.clientHeight - document.body.scrollTop) < 800 && this.status){
			this.requestModule();
			
		}
		
	}

	requestModule(){
		this.status = false;
		let url = '/allGoodsAuction?start='+ this.offset;
		this.xhrRequest('GET', url, null, null, this.generateGoods.bind(this), this)
	}

	generateGoods(obj){

		let object = (JSON.parse(obj)).goods,
			offset = (JSON.parse(obj)).offset,
			tmp = "";

		for (var i = 0; i < object.length; i++) {
			tmp += this.templates(object[i]);
			this.Number++;
		}
		


		this.el.insertAdjacentHTML('beforeend', tmp);
		this.offset = offset;
		this.status = true;

	}



	templates(goods){


		let template = '<div class="a-all-goods-table__item">' + 
						  '<img src="'+decodeURIComponent(goods.src)+'" alt=""/>' + 
						  '<div class="a-all-goods-table__description">' + 
						    '<p class="a-all-goods-table__description_number">№ '+this.Number+'</p>' + 
						    '<span class="a-hidden-block__description-link"> ' + 
				      			'<span><i>Размер: </i> '+decodeURIComponent(goods.size)+'</span>' + 
				      		'</span>' + 
				      		'<span class="a-hidden-block__description-link"> ' + 
				      			'<span><i>Количество: </i> '+decodeURIComponent(goods.countInWarehouse)+' шт.</span>' + 
				      		'</span>' +  
				      		'<p class="a-all-goods-table__description_info">'+(decodeURIComponent(goods.title)).replace(/'/g, "")+'</p>' +
						  '</div>' + 
						  '<div class="a-hidden-block">' + 
						    '<div class="a-hidden-block__img-outer">' + 
						    	'<img src="'+decodeURIComponent(goods.src)+'" alt="" data-number="'+this.Number+'" class="a-image-to-zoom"/>' + 
						    '</div>' + 
						    '<div class="a-hidden-block__description">' + 
						      '<div class="a-hidden-block__description__outer a-table-all-goods-hidden">' + 
						      		'<span class="a-hidden-block__description-link"> ' + 
						      			'<i>Артикул: </i>' + 
						      			'<span>'+decodeURIComponent(goods.art)+'</span>' + 
						      		'</span>' +
						      		'<span class="a-hidden-block__description-link"> ' + 
						      			'<i>Размер </i>' + 
						      			'<span>'+decodeURIComponent(goods.size)+'</span>' + 
						      		'</span>' + 
						      		'<span class="a-hidden-block__description-link"> ' + 
						      			'<i>Количество: </i>' + 
						      			'<span>'+decodeURIComponent(goods.countInWarehouse)+'</span>' + 
						      		'</span>' +  
						      		'<span class="a-else-goods__description_info-link">'  +
								  		'<i>Состав<span>'+( goods.consistOf != 'undefined' ? decodeURIComponent(goods.consistOf) : "Нет данных")+'</span></i>' +
								  	'</span>' +
						      		'<span class="a-else-goods__description_info-link">'  +
								  		'<i>Цвет<span>'+decodeURIComponent(goods.color)+'</span></i>' +
								  	'</span>' +
								  	'<span class="a-else-goods__description_info-link">'  +
								  		'<i>Материал<span>'+(decodeURIComponent(goods.material)).replace(/,|;/g , '<br />')+'</span></i>' +
								  	'</span>' +
						      	'</div>' + 
						      '<p class="a-old-price">Розничная цена на сайте<span>'+decodeURIComponent(goods.price)+' $</span></p>' + 
						      '<p class="a-new-price a-reds-color">Начальная ставка<span>'+decodeURIComponent(goods.auctionPrice)+' $</span></p>' + 
						   ' </div>' + 
						  '</div>' + 
						'</div>';


		return template;			 
	}


}

export default AsyncLoadAllGoods;