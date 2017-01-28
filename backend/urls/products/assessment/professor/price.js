exports.render = (req, res, next) => {
  var model = {
    title: "Стоимость системы «Профессор»",
    path: req.path,
    keywords: "",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}