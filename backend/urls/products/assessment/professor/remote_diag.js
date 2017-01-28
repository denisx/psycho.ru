exports.render = (req, res, next) => {
  var model = {
    title: "Профессор, «Дистанционная диагностика»",
    path: req.path,
    keywords: "",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}