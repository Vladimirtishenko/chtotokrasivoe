var mongoose = require('../../lib/mongoose'),
	configOptions = require('../../middleware/services/configOptions');

module.exports.get = function(req, res, next) {

	 	configOptions.getOption('date', function(err, result) {
	        if (err) next(err);
			var params = result && result.params ? result.params : null;
			res.json({data: params});
	    })
	
}