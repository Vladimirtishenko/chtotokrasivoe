var Goods = require('../models/goods').Goods;

module.exports.get = function(req, res, next) {

    var params = {
        start: req.query.start || 0,
        limit: req.query.limit || 20,
    },
    searchString = {};


    if(req.query.searhByTitle){
        searchString = { $or: [ {"title": {'$regex': encodeURIComponent(req.query.searhByTitle)}}, {"art": {'$regex': encodeURIComponent(req.query.searhByTitle)}} ] };
    }

    Goods.find(searchString, function(err, doc) {

        if (err) {
            next(err);
        }

        res.json({ goods: doc, offset: parseInt(params.start) + (parseInt(params.limit) || 20) });


    }).limit(parseInt(params.limit)).skip(parseInt(params.start)).sort({priority: -1, date: -1});


}
