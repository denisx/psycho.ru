exports.render = (req, res, next) => {
  var model = {
    title: "Методики тестирования системы «Профессор»",
    path: req.path,
    keywords: "",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}