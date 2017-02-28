/**
 * (Ненужная, потому что есть страница категории) страница с архивом библиотеки.
 * Работает немного двусмысленно, потому как выводит абсолютно все статьи,
 * а не только архивные. 
 */
"use strict";
var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  db.articles.findAll({
    attributes: ['id', 'title', 'short_descr'],
    order: 'id DESC'
  })
    .then((a) => {
      var model = {
        title: "Архив",
        keywords: "",
        description: "",
        year: new Date().getFullYear(),
        articles: a // массив со статьями
      };
      res.render(`./library/archive.html`, model);
    });
}