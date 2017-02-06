let db = require(`../../../models/db`);
let sequelize = require('sequelize');
let boostrapPaginator = require('../libs/boostrapPaginator');

module.exports.index = function(req, res) {
	try {
		let limit = 50;
		let page = req.param('page', 1);
		let offset = page * limit;

		db.articles.count()
			.then((count) => {
				db.articles.findAll({ offset: offset, limit: 50,  order: 'id ASC' })
					.then((a) => {
						res.render('admin/views/library.html', {
							data: a,
							count: count,
							error: req.flash('error'),
							mata: { title: 'Админ панель - библиотека' },
							page: page,
							paginate: boostrapPaginator({
								prelink:'/admin/library',
								current: page,
								rowsPerPage: offset,
								totalResult: count,
							})
								.render()
						})
					})
			})
	} catch (e) {
		console.log(e);
	}
};
