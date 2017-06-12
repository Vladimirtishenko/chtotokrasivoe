class Templates {

    allGoods() {

        function templates(id, img, title, description, size, color, material, consistOf, count, priority, price, auctionPrice, art) {

            let sizeEach = (sizes) => {
                let sizesToArray = sizes.split(',');

                let sizesTmp = ""
                sizesToArray.forEach((item, i) => {
                    sizesTmp += '<label class="che-input-with-checkbox__wrapper" for="">'+
                            '<span class="che-input-with-checkbox__title">' + item + '</span>' +
                            '<input type="checkbox" name="size" value="' + item + '"/>' +
                            '<input class="che-input-with-checkbox__item" type="number" min="1" name="countInWarehouse" data-label-count="'+item+'" value="1" />' + 
                        '</label>';
                });

                return sizesTmp;
            }

            let tmp = '<div class="a-all-goods-table__item">' +
                '<img src="' + img + '" alt=""/>' +
                '<div class="a-all-goods-table__description">' +
                '<p class="a-all-goods-table__description_info">' + title + '</p>' +
                '<p class="a-all-goods-table__description_info_article">Артикул: <span>' + (art || "Нет артикула") + '</span></p>' +
                '</div>' +
                '<div class="a-hidden-block">' +
                '<div class="a-hidden-block__description">' +
                '<div class="a-hidden-block__description__outer">' +
                '<span class="a-hidden-block__description-link">' +
                '<i>Размер </i>' +
                '<span>' + size + '</span>' +
                '</span>' +
                '<span class="a-hidden-block__description-link"> ' +
                '<i>Цвет</i>' +
                '<span>' + color + '</span>' +
                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<form class="a-hidden-form">' +
                '<input type="hidden" name="title" value="' + title + '"/>' +
                '<input type="hidden" name="description" value="' + description + '"/>' +
                '<input type="hidden" name="color" value="' + color + '"/>' +
                '<input type="hidden" name="src" value="' + img + '"/>' +
                '<input type="hidden" name="consistOf" value="' + consistOf + '"/>' +
                '<input type="hidden" name="material" value="' + material + '"/>' +
                '<input type="hidden" name="price" value="' + price + '"/>' +
                '<input type="hidden" name="art" value="' + (art || "Нет артикула") + '"/>' +
                '<div class="a-container-for-img"><img src="' + img + '" alt=""/></div>' +
                '<div class="a-hidden-form_description">' +
                '<div class="a-containet-flex-to-start-description">' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__title">' + title + '</p>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Артикул</p><span>' + (art || "Нет артикула") + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Цвет</p><span>' + color + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Размеры</p>' +
                '<div class="che-input-with-checkbox__main">'+sizeEach(size)+'</div>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Цена розничная</p><span>' + price + ' $</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Начальная ставка</p>' +
                '<span><input type="text" name="auctionPrice" value="3"><i> $</i></span>' +
                '</div>' +
                '</div>' +
                '<div class="a-containet-flex-to-end-button">' +
                '<input value="Добавить товар" type="submit" class="a-button-white"/>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>';

            return tmp;
        }

        return templates;

    }


    allGoodsAuction() {

        function templates(id, img, title, description, size, color, consistOf, material, count, priority, price, auctionPrice, art, unsold) {

            let tmp = '<div class="a-all-goods-table__item">' +
                '<span class="a-delete-this-item-with-id" data-id="' + id + '"></span>' +
                '<img src="' + decodeURIComponent(img) + '" alt=""/>' +
                '<div class="a-all-goods-table__description">' +
                '<p class="a-all-goods-table__description_info">' + decodeURIComponent(title) + '</p>' +
                '<p class="a-all-goods-table__description_info_article">Артикул: <span>' + (decodeURIComponent(art) || "Нет артикула") + '</span></p>' +
                '</div>' +
                '<div class="a-hidden-block">' +
                '<div class="a-hidden-block__description">' +
                '<div class="a-hidden-block__description__outer">' +
                '<span class="a-hidden-block__description-link">' +
                '<i>Размер </i>' +
                '<span>' + decodeURIComponent(size) + '</span>' +
                '</span>' +
                '<span class="a-hidden-block__description-link">' +
                '<i>Цена </i>' +
                '<span>' + decodeURIComponent(price) + '</span>' +
                '</span>' +
                '<span class="a-hidden-block__description-link">' +
                '<i>Количество </i>' +
                '<span>' + decodeURIComponent(count) + '</span>' +
                '</span>' +
                '<span class="a-hidden-block__description-link"> ' +
                '<i>Цвет</i>' +
                '<span>' + decodeURIComponent(color) + '</span>' +

                '</span>' +
                '</div>' +
                '</div>' +
                '</div>' +
                '<form class="a-hidden-form">' +
                '<input type="hidden" name="_id" value="' + id + '"/>' +
                '<input type="hidden" name="title" value="' + decodeURIComponent(title) + '"/>' +
                '<input type="hidden" name="description" value="' + decodeURIComponent(description) + '"/>' +
                '<input type="hidden" name="color" value="' + decodeURIComponent(color) + '"/>' +
                '<input type="hidden" name="src" value="' + decodeURIComponent(img) + '"/>' +
                '<input type="hidden" name="consistOf" value="' + decodeURIComponent(consistOf) + '"/>' +
                '<input type="hidden" name="material" value="' + decodeURIComponent(material) + '"/>' +
                '<input type="hidden" name="price" value="' + decodeURIComponent(price) + '"/>' +
                '<input type="hidden" name="auctionPrice" value="' + decodeURIComponent(auctionPrice) + '"/>' +
                '<input type="hidden" name="art" value="' + decodeURIComponent(art) + '"/>' +
                '<div class="a-container-for-img"><img src="' + decodeURIComponent(img) + '" alt=""/></div>' +
                '<div class="a-hidden-form_description">' +
                '<div class="a-containet-flex-to-start-description">' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__title">' + decodeURIComponent(title) + '</p>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Артикл</p><span>' + decodeURIComponent(art) + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Цвет</p><span>' + decodeURIComponent(color) + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Размеры</p>' +
                '<span>' + decodeURIComponent(size) + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Не продано</p>' +
                '<input type="text" name="unsoldCount" value="' + (unsold || 0) + '"/>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Количество на складе</p>' +
                '<input type="text" name="countInWarehouse" value="' + (count || 0) + '"/>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Розничная цена</p>' +
                '<span>' + decodeURIComponent(price) + '</span>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Начальная ставка</p>' +
                '<input type="text" name="auctionPrice" value="' + auctionPrice + '"/>' +
                '</div>' +
                '<div class="container-description-form">' +
                '<p class="container-description-form__else_params">Приоритет</p>' +
                '<input type="checkbox" name="priority" ' + (priority ? "checked" : "") + ' />' +
                '</div>' +
                '</div>' +
                '<div class="a-containet-flex-to-end-button">' +
                '<input value="Добавить товар" type="submit" class="a-button-white"/>' +
                '</div>' +
                '</div>' +
                '</form>' +
                '</div>';

            return tmp;
        }

        return templates;

    }

    config() {
        function templates(date) {

            let templates = '<div class="a-config">' +
                '<div class="a-outer-calendar">' +
                '<p class="a-startet-date">Дата начала: <span>' + (date || 'Не установлена') + '</span></p>' +
                '<div class="a-calendar">' +
                '<input class="a-flatpickr" type="text" placeholder="Выбрать дату">' +
                '</div>' +
                '<button class="a-date-save">Сохранить дату</button>' +
                '</div>' +
                '</div>';
        };

        return templates;

    }

    templatesForUsers(){

        function templates(user) {

            let template = '<tr>'+
                                '<td>'+
                                    user.email +
                                '</td>' +
                                '<td>'+
                                    user.role + 
                                '</td>' +
                                '<td>'+
                                    '<span class="a-user-remove" data-user="'+user.id+'" > Удалить</span>' +
                                '</td>' +
                           '</tr>';

            return template;

        }

        return templates;

    }

    orders() {

        function templates(data) {

            let constructorDate = new Date(data.date).toLocaleDateString(),
                statusText = ['Не оплачен', 'Оплачен', 'Выполнен', 'Отменен', 'Обработан'];

            let templates = '<form class="a-privat-table_bought">' +
                                '<input name="_id" type="hidden" value="'+data._id+'" />' +
                				'<div class="a-privat-table_bought__number">' +
                					'<p>'+
                                        '<span>Заказ </span>№ ' +data.orderNumber+ '<span> от </span> '+constructorDate+' <a class="che-print-image" target="_blank" href="/order/print/'+data._id+'">Другие действия</a></p><span class="a-status-wrapper">Статус: <i class="a-status-'+data.status+'">'+statusText[data.status]+'</i></span>' +
                					'<p>На сумму: <span class="a-common-price-'+data._id+'">'+data.priceCommon+' $</span></p>' +
                				'</div>' +
                                '<input type="checkbox" class="a-show-or-hide-order" value="Открыть" />' +
                				'<div class="a-orders-description a-orders-hide-block"><div class="a-privat-table a-privat-table__bought a-privat-table__orders">' +
                                    '<div class="a-privat-table__info_order">' +
                                        '<h5>Заказ:</h5>' +
                    					'<table>'+
    					                	'<tr cols="2">'+
                                                '<th></th>'+
    					                		'<th>Наименование</th>'+
                                                '<th>Размер</th>'+
    					                		'<th>Цвет</th>'+
    					                		'<th>Количество</th>'+
    					                		'<th>Цена</th>'+
    					                	'</tr>'+
    					                	ordersOne(data.goods, data._id) + 
					                   '</table>'+
                                       '<div class="a-status-block">' +
                                       '<h5 class="a-status-orders"><span>Статус:<span></h5>' +
                                       '<select class="a-privat-table__changed" name="status">'+
                                            statusChecker(data.status) +  
                                       '</select>'+
                                       '</div>' +
                                    '</div>' +
	                				'<div class="a-privat-table__user">' +
	                					'<h5>Информация о заказе:</h5>' +
                                        '<table>'+
                                            '<tr>'+
                                                '<th>Страна</th>' +
                                                '<td><input name="country" type="text" value="'+decodeURIComponent(data.country)+'" /></td>' +
                                            '</tr>'+
                                             '<tr>'+
                                                '<th>Город</th>' +
                                                '<td><input name="sity" type="text" value="'+decodeURIComponent(data.sity)+'" /></td>' +
                                            '</tr>'+
                                            '<tr>'+
                                                '<th>Служба доставки</th>' +
                                                '<td><input name="delivery" type="text" value="'+decodeURIComponent(data.delivery)+'" /></td>' +
                                            '</tr>'+
                                            '<tr>'+
                                                '<th>Склад</th>' +
                                                '<td><input name="warehouse" type="text" value="'+decodeURIComponent(data.warehouse)+'" /></td>' +
                                            '</tr>'+
                                        '</table>'+
	                					'<h5>Информация о клиенте:</h5>' +
                                        '<table>'+
                                            '<tr>'+
                                                '<th>ФИО</th>' +
                                                '<td>'+decodeURIComponent(data.fio)+'</td>' +
                                            '</tr>'+
                                             '<tr>'+
                                                '<th>Номер телефона</th>' +
                                                '<td>'+decodeURIComponent(data.number)+'</td>' +
                                            '</tr>'+
                                            '<tr>'+
                                                '<th>Почта</th>' +
                                                '<td>'+decodeURIComponent(data.email)+'</td>' +
                                            '</tr>'+
                                        '</table>'+
	                				'</div>' +
                                '</div>'+
                                '<div class="a-saved-status">'+
                                    '<button type="submit" class="a-privat-table__submit">Сохранить</button>' +
                                '</div>'+
                                '</div>'+
            				'</form>';



            function ordersOne(goods, id) {
                var tmp = "",
                    count = 0,
                    price = 0,
                    color = "";

                for (var key in goods) {

                    count += +goods[key].count;
                    price += +goods[key].price,
                    color = decodeURIComponent(goods[key].color).replace("+", " + ");

                    tmp += '<tr>'+
                                '<td data-number="'+key+'" data-id="'+id+'" class="a-remove-item-order">X</td>'+
		                		'<td>'+decodeURIComponent(goods[key].art) + ' / ' +decodeURIComponent(goods[key].title)+'</td>'+
                                '<td>'+decodeURIComponent(goods[key].size)+'</td>'+
		                		'<td>'+color+'</td>'+
		                		'<td>'+goods[key].count+'</td>'+
		                		'<td>'+goods[key].price+'</td>'+
		                	'</tr>';
                }

                return tmp;


            }

            function statusChecker(status){

                var str = '';

                for (var i = 0; i < statusText.length; i++) {
                    var active = (status == i) ? 'selected' : '';
                    str +=  '<option '+active+' value="'+i+'">' +
                                statusText[i] + 
                            '</option>'
                }

                return str;

            }

            return templates;

        }


        return templates;


    }



}

export default new Templates;
