var Goods = require('../../models/goods.js').Goods;

module.exports.get = function(req, res, next) {

	Goods.find({$where: "this.unsoldCount > 0"}, function(err, goods){

		if(err) next(err);
		res.render('print_unsold_goods', {
			title: 'Print unsold goods',
			data: goods
		});
	})  

}