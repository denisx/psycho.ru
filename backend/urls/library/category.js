/**
 * Отображение статей категории
 */
"use strict";
var db = require(`../../models/pg_db.js`);

exports.render = (req, res, next) => {
  var catLink = /^\/library\/([\w\d_]{1,50})$/.exec(req.path)[1];
  let query = `
    SELECT la.id, la.title, la.short_descr, lc.name
    FROM library_articles la, library_categories lc
    WHERE lc.link = $1
	    AND lc.id = la.category
    ORDER BY la.date_create DESC;`;
  db.execute(query, [catLink])
    .then((a) => {
      // рендерим страницу
      var model = {
        title: a.rows[0].name,
        keywords: '',
        description: '',
        year: new Date().getFullYear(),
        articles: a.rows
      };
      return res.render(`./library/category.html`, model);
    })
    .catch((e) => {
      return next();
    });
  return;
}