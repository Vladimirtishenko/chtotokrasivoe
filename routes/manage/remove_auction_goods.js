var config = require('../../config/');
var Goods = require('../../models/goods.js').Goods;

module.exports.get = function(req, res, next){

	if(req.query.key != config.get("secret_keys") || req.query.key == '' || !req.query.key){
		res.json({
			status: 500,
			errorMsg: 'Ключ не верен!'
		})
	}

	Goods.remove({}, function(err, data){
		if(err){
			res.json({
				status: 500,
				errorMsg: 'Произошла ошибка при удалении, попробуйте позже!'
			})
		}

		res.json({
			status: 200,
			successMsg: 'Удаление успешно!'
		})

	})
	

}