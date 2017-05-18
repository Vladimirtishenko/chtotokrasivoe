var AuctionInfo = require('../../models/auction_info');

module.exports.get = function(req, res, next) {

	AuctionInfo.find({}, function(err, rules){
		if(err) next(err);
		res.render('index_info_auction', {
	        title: "Auction Info",
	        rules: rules[0] || {}
	    });
	}) 

}

module.exports.post = function(req, res, next) {

	AuctionInfo.update({fieldId: req.body.fieldId}, req.body, {upsert: true, new: true}, function(err, doc){
		if(err) next(err)

		res.json({
			status: 200
		})
	})

}