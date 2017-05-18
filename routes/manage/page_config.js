var mongoose = require('../../lib/mongoose'),
	configOptions = require('../../middleware/services/configOptions'),
	Users = require('../../middleware/modules/Users/models/SchemaModel'),
	async = require("async");


module.exports.get = function(req, res, next) {

	 async.waterfall([
            dataTry,
            users,
        ], function(err, result) {
        	if(err) next(err);
        	res.render('index_config', {
	            title: "Checheluka Admin",
	            params: result.date,
	            users: result.users
	        });
        })


	 function dataTry(callback){
	 	configOptions.getOption('date', function(err, result) {
	        if (err) next(err);
			var params = result && result.params ? result.params : {};
			callback(null, params);
	    })
	 }

	 function users(date, callback){
	 	Users.find({role: 'admin'}, function(err, users){
	 		if (err) next(err);
	        callback(null, {date: date, users: users})
		})
	 }
}


module.exports.post = function(req, res, next) {

	var configField = Object.keys(req.body)[0],
		configParams = req.body[configField];


	configOptions.saveOption(
		    configField,
			configParams,
			function(err, doc){
		   		if(err) {
		   			res.json({status: 500})
		   		} else{
		   			res.json({status: 200})
		   		}
		   }
		);


}

