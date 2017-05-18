module.exports.get = function(req, res, next) {

    res.render('index_comments', {
        title: "Page Comments"
    });

}