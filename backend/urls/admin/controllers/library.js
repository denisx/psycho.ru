/**
 * Рендер страницы со списком статей библиотеки
 */
"use strict";
let db = require(`../../../models/db`);
let sequelize = require('sequelize');
let boostrapPaginator = require('../libs/boostrapPaginator');

exports.index = function index(req, res, next) {
  let limit = 50;
  let page = 1;
  if(req.params.page) page = req.params.page;
  let offset = page * limit;

  db.articles.count() // счетчик статей для педжинга
  .then(count => {findAll(count);})
  .catch(e => { next(e); });
  
  function findAll(count) { // выборка нужного количества статей
    db.articles.findAll({ offset: offset, limit: limit,  order: 'id ASC' })
    .then((a) => {
      render(count, a);
    })
    .catch(e => { next(e); });
  }

  function render(count, a) { // рендер страницы
    res.render('admin/views/library.html', {
      data: a, // статьи
      count: count, // общее кол-во статей
      error: req.flash('error'), // TODO - разобраться что это такое
      mata: { title: 'Админ панель - библиотека' },
      page: page, // номер текущей страницы в пейджинге
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
