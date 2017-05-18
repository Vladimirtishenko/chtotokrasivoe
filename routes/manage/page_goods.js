module.exports.get = function(req, res, next) {

    res.render('index_manage', {
        title: "Goods from Chechelyka"
    });

}