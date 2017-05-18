module.exports.get = function(req, res, next) {

    res.render('index_auction', {
        title: "Auction goods"
    });

}