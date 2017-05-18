 var Order = require('../../models/order_save.js')

module.exports.get = function (req, res, next) {
	
	if(!req.query._id){
		res.json({
			status: 500,
			errorMsg: 'Ошибка ID не передано!'
		})
	}

	Order.findOne({_id: req.query._id}, function(err, ord){

		for (var key in ord.goods) {
			if(key == req.query._number){
				var price = ord.goods[key].price;
				delete ord.goods[key];
			}
		}

		ord.priceCommon -= (+price);

		ord.markModified('goods');
		ord.save(function(err, doc){
			if(err){
				res.json({
					status: 500,
					errorMsg: 'Ошибка не возможно удалить!'
				})
			}
			res.json({
				status: 200,
				priceUpdated: ord.priceCommon,
				_id: req.query._id
			})
		});

	})

}

module.exports.post = function (req, res, next) {
	
	if(!req.body._id){
		res.json({
			status: 500,
			errorMsg: 'Ошибка ID не передано!'
		})
	}

	Order.update({_id: req.body._id}, req.body, function(err, data){
		if(err){
			res.json({
				status: 500,
				errorMsg: 'Ошибка невозможно обновить!'
			})
		} 
		res.json({
			status: 200,
			successMsg: 'Заказ успешно обновлен!'
		})	
	})

}