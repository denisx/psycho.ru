var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  var id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
  db.articles.findById(id)
    .then((a) => {
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
    });
}