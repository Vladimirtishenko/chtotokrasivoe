var json2csv = require('json2csv');
var fs = require('fs');
var Users = require('../../middleware/modules/Users/models/SchemaModel.js');

module.exports.get = function(req, res, next){
	

	Users.find({role: {$ne: "admin"}}, {date:true, email: true, city: true, _id: false}, function(err, data){
		if(err){
			next(err);
		}
		
		var fields = ['date', 'email', 'city'];
		var csv = json2csv({ data: data, fields: fields });

		res.attachment('user.csv');
		res.send(csv);

	}).sort({"_id": -1})

	
	 
}