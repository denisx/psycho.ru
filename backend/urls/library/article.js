var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  if(req.byId) {
    var id = /^\/library\/(\d{1,4})$/.exec(req.path)[1];
    db.articles.findById(id)
    .then((a) => {
      return renderArticle(a, res);
    })
    .catch((e) => {
      return next();
    });
  }
  else if(req.byLink) {
    var links = /^\/library\/([\w\d_]{1,50})\/([\w\d_]{1,100})$/.exec(req.path);
    db.libCats.findOne({ where: {link: `{${links[1]}}`}})
    .then((c) => {
      return db.articles.findOne({
        where: {category: c.id, link: links[2]}
      })
      .then((a) => {
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