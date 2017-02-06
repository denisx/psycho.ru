let db = require(`../../../models/db`);
let sequelize = require('sequelize');
let pagination = require('pagination');

/**
 * function for show data for edit in library by id
 */
module.exports.edit = function(req, res) {
	try {
		db.articles.findById(req.param('id'))

			.then((a) => {
				res.render('admin/views/library_edit.html', {
					data: a,
					error: req.flash('error'),
					mata: {title: `Админ панель - редактирование - ${a.title}`}
				})
			})
	} catch (e) {
		console.log(e);
	}
};

/**
 * function to save the edited data in library by id
 */
module.exports.editPost = function(req, res) {
	try {
		db.articles.update(
			{
				author     : req.body.author,
				body       : req.body.body,
				description: req.body.description,
				intro      : req.body.intro,
				keywords   : req.body.keywords,
				title      : req.body.title,
				shortDesc  : req.body.shortDesc,
			},
			{where: {id: req.param('id')}}
		)

			.then(() => {
				res.redirect(`/admin/library?page=${req.param('page', 1)}`);
			})

			.catch(err => {
				res.send(err);
			})
	} catch (e) {
		console.log(e);
	}
};
