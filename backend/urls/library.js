/**
 * Индексная страница библиотеки (/library)
 */
"use strict";
var db = require(`../models/db.js`);

exports.render = (req, res, next) => {
  // статья по числовому Id
  if(/^\/library\/(\d{1,4})$/.test(req.path)) {
    req.byId = true;  // флаг для сохранения информации о типе запроса
    return require('./library/article').render(req, res, next);
  }
  // статья по текстовой ссылке через категорию
  if(/^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.test(req.path)) {
    req.byLink = true; // флаг о типе запроса
    return require('./library/article').render(req, res, next);
  }
  // архив библиотеки
  // else if(req.path === "/library/archive") {
  //   return require('./library/archive').render(req, res, next);
  // }
  // категория
  if(/^\/library\/([\w\d_]{1,50})$/.test(req.path)) {
    return require('./library/category').render(req, res, next);
  }
  // индексная страница библиотеки
  if(req.path === "/library") {
    // в раздел "последние поступления" возьмём 5 последних статей
    db.articles.findAll({
      attributes: ['id', 'title', 'shortDesc'],
      order: '"createdAt" DESC',
      limit: 5
    })
      .then((a) => {
        var model = {
          title: "Библиотека",
          keywords: "статьи по психологии, интересная психология, корпоративная психология",
          description: "Электронная библиотека книг, статей по психологии, а также психологических текстов, онлайн интервью с экспертами в различных областях психологии; новости современной психологии, маркетинга, рекламы, управленческих технологий",
          year: new Date().getFullYear(),
          articles: a
        };
        res.render(`.${req.path}.html`, model);
      });
  }
  else return next();
}