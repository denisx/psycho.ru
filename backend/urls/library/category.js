var db = require(`../../models/db.js`);

exports.render = (req, res, next) => {
  var catLink = /^\/library\/([\w\d_]{1,50})$/.exec(req.path)[1];
  db.libCats.findOne({ where: {link: `{${catLink}}`}})
  .then((c) => {
    return db.articles.findAll({
      where: {category: c.id},
      attributes: ['id', 'title', 'shortDesc'],
      order: '"createdAt" DESC'
    })
      .then((a) => {
        var model = {
          title: c.name,
          keywords: "",
          description: "",
          year: new Date().getFullYear(),
          articles: a
        };
        return res.render(`./library/category.html`, model);
      })
      .catch((e) => {
        return next();
      });
  })
  .catch((e) => {
    return next();
  });
  return;
}