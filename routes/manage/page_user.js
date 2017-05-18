var Users = require('../../middleware/modules/Users/models/SchemaModel.js');

module.exports.get = function(req, res, next){

	Users.find({role: {$ne: "admin"}}, function(err, data){
		if(err){
			next(err);
		}
		res.render('index_users', {
			title: "User view",
			data: data
		})
	}).sort({"_id": -1})

}

module.exports.delete = function(req, res, next){

	if(!req.body.id){
		res.json({
			status: 500,
			errmsg: 'Не передан ID'
		})
		res.end();
	}

	Users.remove({_id: req.body.id}, function(err, data){
		
		if(err){
			res.json({
				status: 500,
				errmsg: err.errorMsg
			})
			res.end();
		}

		res.json({
			status: 200
		})
		res.end();

	})

}