/**
 * Отображение статьи
 */
"use strict";
var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  // если запрос по id, т.е. вида /library/[число]
  if(req.byId) {
    var id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
    db.articles.findById(id)  // выбираем статью по id
    .then((a) => {
      return renderArticle(a, res);
    })
    .catch((e) => {
      return next();
    });
  }
  // если запрос по ссылке, 
  // т.е. вида /library/[ссылка категории]/[ссылка статьи]
  // происходит 2 запроса к базе, что плохо, но, как временный вариант, пойдет
  else if(req.byLink) {
    var links = /^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.exec(req.path);
    // получим id категории по ссылке
    db.libCats.findOne({ where: {link: `{${links[1]}}`}})
    .then((c) => {
      // после выберем нужную статью по id категории и ссылке самой статьи
      return db.articles.findOne({
        where: {category: c.id, link: links[2]}
      })
      .then((a) => {
        // выбранную статью срендерим
        return renderArticle(a, res);
      })
      .catch((e) => {
        return next();
      });
    })
    .catch((e) => {
      return next();
    });
  }
}

// рендер выбранной статьи
function renderArticle(a, res) {
  var model = {
    title: a.title,
    keywords: a.keywords,
    description: a.description,
    year: new Date().getFullYear(),
    intro: a.intro,
    body: a.body,
    author: a.author
  };
  res.render(`./library/article.html`, model);
}