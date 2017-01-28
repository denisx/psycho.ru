var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  var id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
  db.articles.findById(id)
    .then((a) => {
      var model = {
        title: a.title,
        keywords: "",
        description: "",
        year: new Date().getFullYear()
      };
      res.render(`./library/article.html`, model);
    });
}