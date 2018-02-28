/**
 * (Ненужная, потому что есть страница категории) страница с архивом библиотеки.
 * Работает немного двусмысленно, потому как выводит абсолютно все статьи,
 * а не только архивные. 
 */
"use strict";
var db = require(`../../models/pg_db.js`);

exports.render = (req, res, next) => {
  let query = `
    SELECT 
      id
      ,title
      ,short_descr
    FROM library_articles
    ORDER BY id DESC;`;
  db.execute(query, [])
    .then((a) => {
      var model = {
        title: "Архив",
        keywords: "",
        description: "",
        year: new Date().getFullYear(),
        articles: a.rows // массив со статьями
      };
      res.render(`./library/archive.html`, model);
    });
}