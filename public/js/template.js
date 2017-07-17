class Template {
	getCurrentAuction(id, obj, price, timer, count, difference){
		return '<div class="a-general-goods a-animates-top-goods">' + 
				  '<div class="a-general-goods__image">' +
				  	'<span class="a-general-number__this_main">№'+id+'</span>' +
				   	'<div class="a-img-scale">' +
				    	'<img src="'+decodeURIComponent(obj.src)+'" alt="" class="a-image-to-zoom" data-number="'+id+'" />' +
				    '</div>' +
				  '</div>' +
				  '<div class="a-general-goods__description">' +
				    '<p class="a-general-goods__description_in-warehouse a-min-size-font">На складе: <span>'+decodeURIComponent(obj.countInWarehouse)+' ед.</span></p>' +
				    '<h2 class="a-general-goods__description_title">'+decodeURIComponent(obj.title).replace(/'/g , '')+'</h2>' +
				    '<div class="a-general-goods__description_description">'+decodeURIComponent(obj.description)+'</div>' +
				    '<div class="a-general-goods__description_info">' +
				      '<div class="a-general-goods__description_info_part">' +
				      	'<a href="" class="a-general-goods__description_info_part-link">' +
				      		'<i>Размер:</i>' +
				      		'<span>'+decodeURIComponent(obj.size)+'</span>' +
				      	'</a>' +
				      	'<a href="" class="a-general-goods__description_info_part-link">'  +
				      		'<i>Цвет:</i>' +
				      		'<span>'+decodeURIComponent(obj.color)+'</span>' +
				      	'</a>' +
				      '</div>' +
				      '<div class="a-general-goods__description_info_part">' +
				      	'<a href="" class="a-general-goods__description_info_part-link">' +
				      		'<i>Состав:</i>' +
				      		'<span>'+( obj.consistOf != 'undefined' ? decodeURIComponent(obj.consistOf) : "Нет данных")+'</span>' +
				      	'</a>' +
				      	'<a href="" class="a-general-goods__description_info_part-link">'  +
				      		'<i>Материал: </i>' +
				      		'<span>'+( obj.material != 'undefined' ? decodeURIComponent(obj.material) : "Нет данных")+'</span>' +
				      	'</a>' +
				      '</div>' +
				    '</div>' +
				    '<p class="a-general-goods__description_price_retail">Розничная цена: <span>'+decodeURIComponent(obj.price)+' $</span></p>' +
				    '<p class="a-general-goods__description_price_now"><i class="a-general-goods__description_price_now_upgraded">'+price+'</i> <span>$</span></p>' +
				    '<span class="a-add-rate">'+(difference ? 'Ставка сделана! Невозможно сделать еще ставку, ождидайте завершения торгов!' : '')+'</span>' +
				    '<div class="a-for-mobile-absolute">' +
				      '<div class="a-general-goods__time_to_end">' +
				        '<button class="a-general-goods__description_buy a-button-black">Покупаю</button>' +
				        '<label class="a-type-to"> <input class="a-type-to-count" value="'+count+'" type="number" name="countOnBuy" min="1" max="'+obj.countInWarehouse+'" /> <span class="a-type-to-count-name">шт.</span></label>' +
				      '</div>' +
				      '<p class="a-general-goods__time_to_end__timer">До завершения -  <span class="a-times-frontend">00:'+(timer < 10 ? '0' + timer : timer)+'</span></p>' +
				      '<p class="a-info-about-rates">Система повышает ставки автоматически на 0.5 $, если хотите повысить ставку сразу нажмите на одну из кнопок ниже!</p>' +
				      '<div class="a-general-goods__description_rates_button">' +
				        '<button class="a-button-white">+ <i class="a-top-number-price">1</i> $</button>' +
				        '<button class="a-button-white">+ <i class="a-top-number-price">2</i> $</button>' +
				        '<button class="a-button-white">+ <i class="a-top-number-price">3</i> $</button>' +
				        '<button class="a-button-white">+ <i class="a-top-number-price">5</i> $</button>' +
				      '</div>' +
				    '</div>' +
				  '</div>' +
				'</div>';
	}

	getAuctions(id, obj, className){

		return '<div class="a-else-goods__item '+ className +'" >' +
						'<div class="a-resizer-masonry">' +
							'<img src="'+decodeURIComponent(obj.src)+'" class="a-image-to-zoom" data-number="'+id+'"/>' +
						'</div>' +
						'<div class="a-else-goods__description">' +
						  '<p class="a-number-goods"> №'+id +
						    '<span></span>' +
						  '</p>' +
						  '<p class="a-else-goods-descroption">'+decodeURIComponent(obj.title).replace(/'/g , '')+'</p>' +
						  '<div class="a-else-goods__description_info">' +
						  	'<span class="a-else-goods__description_info-link">'  +
						  		'<i>Состав<span>'+decodeURIComponent(obj.consistOf)+'</span></i>' +
						  	'</span>' +
						  	'<span class="a-else-goods__description_info-link"> ' +
						  		'<i>Размер<span>'+decodeURIComponent(obj.size)+'</span></i>' +
						    '</span>' +
						  	'<span class="a-else-goods__description_info-link"> ' +
						  		'<i>Цвет<span>'+decodeURIComponent(obj.color)+'</span></i>' +
						  	'</span>' +
						  	'<span class="a-else-goods__description_info-link"> ' +
						  		'<i>Ткань<span>'+(decodeURIComponent(obj.material)).replace(/,|;/g , '<br />')+'</span></i>' +
						  	'</span>' +
						 '</div>' +
						  '<p class="a-old-price">Розничная цена<span>'+(decodeURIComponent(obj.price))+' $</span></p>' +
						 ' <p class="a-new-price">Начальная ставка<span>'+(decodeURIComponent(obj.auctionPrice))+' $</span></p>' +
						'</div>' +
					 '</div>';
	}
}

export default new Template;