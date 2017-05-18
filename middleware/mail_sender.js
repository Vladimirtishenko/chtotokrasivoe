var email  = require("emailjs/email");
var config = require('../config/');
var template = require('../public/templates/email.js');

module.exports = function(req, callback){

	var server = email.server.connect({
	   user:     config.get("message:email"),
	   password: config.get("message:pass"), 
	   host:     config.get("message:smtp")
	});

	server.send({
	   text:    '', 
	   from:    "Первый честный аукцион одежды <sale@chechelyka-auction.com>", 
	   to:      req.body.email,
	   subject: req.body.subject || 'Ваш заказ отправлен!',
	   attachment: 
	   [
	      {data: template(req.body), alternative: true},
	   ]
	}, function(err, message) { 

		callback(err, message);

	 });
}