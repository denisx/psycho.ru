exports.render = (req, res, next) => {
  var model = {
      title: "Психология и бизнес",
      path: req.path,
      keywords: "психология, бизнес, коучинг, тренинги, вовлеченность, корпоративная культура",
      description: "Психология в бизнесе. Статьи, книги по психологии, тесты, психологические тренинги, NLP, коучинг."
    };
  res.render("index.html", model);
}