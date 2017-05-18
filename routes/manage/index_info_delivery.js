var AuctionDelivery = require('../../models/info_delivery');

module.exports.get = function(req, res, next) {

	AuctionDelivery.find({}, function(err, rules){
		if(err) next(err);
		res.render('index_info_delivery', {
	        title: "Auction Delivery",
	        rules: rules[0] || {}
	    });
	})  

}

module.exports.post = function(req, res, next) {

	AuctionDelivery.update({fieldId: req.body.fieldId}, req.body, {upsert: true, new: true}, function(err, doc){
		if(err) next(err)

		res.json({
			status: 200
		})
	})

}