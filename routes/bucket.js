var ordersBucket = require('../middleware/modules/Orders/models/SchemaModel');

module.exports.post = function(req, res, next) {

	 if (req.session.user) {
		ordersBucket.find({ userId: req.session.user._id }, function(err, data) {
            var priseSum = 0,
                count = 0;

            for (var i = 0; i < data.length; i++) {
                count += data[i].count;
                priseSum += parseInt(data[i].finalePrice) * data[i].count;
            } 

            if(err){
            	res.json({
	            	bucketPrice: null,
            		bucketCount: null
            	})
            } else {
            	res.json({
	            	bucketPrice: priseSum,
	                bucketCount: count
            	})
            }
            

        })
    } else {
    	res.json({
    		bucketPrice: null,
            bucketCount: null
    	})
    }
}