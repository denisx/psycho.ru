var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  db.articles.findAll({
    attributes: ['id', 'title', 'shortDesc'],
    order: 'id DESC'
  })
    .then((a) => {
      var model = {
        title: "Архив",
        keywords: "",
        description: "",
        year: new Date().getFullYear(),
        articles: a
      };
      res.render(`./library/archive.html`, model);
    });
}