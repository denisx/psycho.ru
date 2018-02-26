/**
 * Индексная страница библиотеки (/library)
 */
'use strict';
const dbs = require('../models/db.js'),
  db = require('../models/pg_db');

exports.render = (req, res, next) => {
  // статья по числовому Id
  if(/^\/library\/(\d{1,4})$/.test(req.path)) {
    req.byId = true; // флаг для сохранения информации о типе запроса
    return require('./library/article').render(req, res, next);
  }
  // статья по текстовой ссылке через категорию
  if(/^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.test(req.path)) {
    req.byLink = true; // флаг о типе запроса
    return require('./library/article').render(req, res, next);
  }
  // категория
  if(/^\/library\/([\w\d_]{1,50})$/.test(req.path)) {
    return require('./library/category').render(req, res, next);
  }
  // индексная страница библиотеки
  if(req.path === '/library') {
    // в раздел "последние поступления" возьмём 5 последних статей
    // пример запроса через севалайз
    dbs.articles.findAll({
      attributes: ['id', 'title', 'short_descr'],
      limit: 5,
      order: 'date_create DESC',
    })
    // // пример запроса через pg
    // let query = `
    //   SELECT
    //     la.id
    //     ,la.title
    //     ,la.short_descr
    //   FROM library_articles la
    //   WHERE la.date_delete ISNULL
    //   order BY la.date_update DESC
    //   LIMIT 5;`;
    // db.execute(query, [])
      .then((a) => {
        // вариант получения статей через секвалайз
        res.locals.articles = a;
        // // вариант получения статей через pg
        // res.locals.a = a.rows;
        res.locals.description = 'Электронная библиотека книг, статей по психологии, а также психологических текстов, онлайн интервью с экспертами в различных областях психологии; новости современной психологии, маркетинга, рекламы, управленческих технологий';
        res.locals.keywords = 'статьи по психологии, интересная психология, корпоративная психология';
        res.locals.title = 'Библиотека';
        res.locals.tplUrl = `.${req.path}.html`;
        return next();
      })
      .catch((e) => {
        next(e);
      });
  }
  else {
    return next();
  }
};
