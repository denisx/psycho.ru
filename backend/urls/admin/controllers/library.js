let db = require(`../../../models/db`);
let sequelize = require('sequelize');
let boostrapPaginator = require('../libs/boostrapPaginator');

exports.index = function index(req, res, next) {
  let limit = 50;
  let page = 1;
  if(req.params.page) page = req.params.page;
  let offset = page * limit;

  db.articles.count()
  .then(count => {findAll(count);})
  .catch(e => { next(e); });
  
  function findAll(count) {
    db.articles.findAll({ offset: offset, limit: limit,  order: 'id ASC' })
    .then((a) => {
      render(count, a);
    })
    .catch(e => { next(e); });
  }

  function render(count, a) {
    res.render('admin/views/library.html', {
      data: a,
      count: count,
      error: req.flash('error'),
      mata: { title: 'Админ панель - библиотека' },
      page: page,
      paginate: 
        boostrapPaginator({
          prelink:'/admin/library',
          current: page,
          rowsPerPage: offset,
          totalResult: count,
        })
        .render()
    });
  }
};
