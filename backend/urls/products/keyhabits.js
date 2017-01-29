exports.render = (req, res, next) => {
  var model = {
    title: "Формирование полезных привычек",
    path: req.path,
    keywords: "коучинг, персональные планы, тренажеры полезных привычек",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}