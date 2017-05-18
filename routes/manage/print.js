var Auction = require('../../middleware/modules/Product/models/SchemaModel.js');

module.exports.get = function(req, res, next) {

	Auction.find({$where: "this.countInWarehouse > 0"}, function(err, rules){
		if(err) next(err);
		res.render('print', {
			title: 'Print goods',
			data: rules
		});
	})  

}