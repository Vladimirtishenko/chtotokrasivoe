var Order = require('../../models/order_save');

module.exports.get = function(req, res, next) {

	Order.findOne({_id: req.params.id}, function(err, order){

		if(err) next(err);
		res.render('print_order', {
			title: 'Print goods',
			data: order
		});
	})  

}