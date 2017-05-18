module.exports = function(req, res, next){

	if(req.session && req.session.user && req.session.user.role == 'admin'){
		next();
	} else {
		res.render('login', {
			user: arguments[3] || null
		});
	}
}