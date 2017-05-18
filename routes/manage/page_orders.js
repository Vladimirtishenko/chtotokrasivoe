module.exports.get = function(req, res, next) {

    res.render('index_orders', {
        title: "Order page"
    });

}