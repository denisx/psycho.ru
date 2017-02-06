let passport = require('passport');
let controllers = require('require-tree')('./controllers');
let router = require("express").Router();

router.route(['/admin']).get((req, res) => { if (!req.isAuthenticated()) res.redirect('/admin/login') });

router.route(['/admin/login']).get((req, res) => {

	if (req.isAuthenticated()) {
		res.redirect('/admin/library');

		return;
	}

	res.render('admin/views/login.html', {
		error: req.flash('error').toString()
	});
});

router.route('/admin/logout').get((req, res) => { req.logout(); res.redirect('/admin/login'); });

router.route('/admin/login').post(passport.authenticate('local', {
	successRedirect: '/admin/library',
	failureRedirect: '/admin/login',
	failureFlash: true
}));

router.route(['/admin/library', '/admin/library/page/:page?']).get((req, res) => { controllers.library.index(req, res) });

router.route('/admin/library/edit/:id?')
	.get((req, res) => { controllers.libraryEdit.edit(req, res) })
	.post((req, res) => { controllers.libraryEdit.editPost(req, res) });

module.exports = router;
