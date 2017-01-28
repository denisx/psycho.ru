exports.render = (req, res, next) => {
  if(/^\/library\/(\d{1,4})$/.test(req.path)) {
    return require('./library/article').render(req, res, next);
  }
  else return next();
  var model = {
    title: "Библиотека",
    keywords: "статьи по психологии, интересная психология, корпоративная психология",
    description: "Электронная библиотека книг, статей по психологии, а также психологических текстов, онлайн интервью с экспертами в различных областях психологии; новости современной психологии, маркетинга, рекламы, управленческих технологий",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}