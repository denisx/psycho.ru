var db = require(`../models/db.js`);

exports.render = (req, res, next) => {
  if(/^\/library\/(\d{1,4})$/.test(req.path)) {
    return require('./library/article').render(req, res, next);
  }
  else if(req.path === "/library/archive") {
    return require('./library/archive').render(req, res, next);
  }
  else if(req.path === "/library") {
    db.articles.findAll({
      attributes: ['id', 'title', 'shortDesc'],
      order: 'id DESC',
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