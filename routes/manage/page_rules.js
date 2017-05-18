var Rules = require('../../models/rules');

module.exports.get = function(req, res, next) {

	Rules.find({}, function(err, rules){
		if(err) next(err);
		res.render('index_rules', {
	        title: "Rules",
	        rules: rules[0] || {}
	    });
	})  

}

module.exports.post = function(req, res, next) {

	Rules.update({fieldId: req.body.fieldId}, req.body, {upsert: true, new: true}, function(err, doc){
		if(err) next(err)

		res.json({
			status: 200
		})
	})

}