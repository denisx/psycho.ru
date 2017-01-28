exports.render = (req, res, next) => {
  var model = {
    title: "Инструменты оценки",
    path: req.path,
    keywords: "тестирование, отбор, подбор, ассессмент",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}