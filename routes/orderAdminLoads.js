var Order = require('../models/order_save');

module.exports.get = function(req, res, next) {

    var params = {
        start: req.query.start || 0,
        limit: req.query.limit || 20,
    };
    searchString = {};

    if(req.query.searhByTitle){

        var orders = isNaN(req.query.searhByTitle) ? null : {'orderNumber': parseInt(req.query.searhByTitle)}

        searchString =  orders || {'fio': {'$regex': encodeURIComponent(req.query.searhByTitle), $options: 'i'}};
                                           
    }

    if(req.query.searhByStatus){

        searchString = isNaN(req.query.searhByStatus) ? 0 : {'status': parseInt(req.query.searhByStatus)}

    }

    Order.find(searchString, 

        function(err, doc) {

        if (err) {
            next(err);
        }

        res.json({ goods: doc, offset: parseInt(params.start) + (parseInt(params.limit) || 20) });


    }).sort({"orderNumber": -1}).limit(parseInt(params.limit)).skip(parseInt(params.start));


}


module.exports.post = function(req, res, next) {

    if(req.body.orderNumber && req.body.status){
        Order.update({'orderNumber': Number(req.body.orderNumber)}, {$set: {"status": req.body.status}}, function(err, doc){

            if (err) {
                next(err);
            }

            res.json({status: 200})

        })
    } else{
        res.json({status: 401})
    }

   

}
