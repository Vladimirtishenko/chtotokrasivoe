var mail = require('../../middleware/mail_sender.js');
var Order = require('../../models/order_save.js');
var async = require("async");

module.exports.post = function(req, res, next) {

	async.parallel({
	    send: function(callback) {
	        mail(req, function(err, message){
				callback(err, message);
			});
	    },
	    orderUpdate: function(callback) {
	        Order.update({_id: req.body.orderId}, {status: req.body.status}, function(err, data){
	        	callback(err, data);	
			})
	    }
	}, function(err, results) {
	    
	    if(err){
			res.json({
				status: 500,
				errorMsg: 'Сообщение не отправлено, внутренняя ошибка транспорта писем!'
			})
			next();
			return;
		}

		res.json({
			status: 200,
			successMsg: 'Сообщение отправлено!'
		})

	});

}
