exports.render = (req, res, next) => {
  var model = {
    title: "О компании",
    path: req.path,
    keywords: "корпоративное обучение и тренинги, бизнес тренинги",
    description: "Поможем вам раскрыть потенциал организации, повысить продуктивность, результативность и другие бизнес показатели за счёт воздействия на психологические факторы — на мотивацию, вовлечённость и лидерство её руководителей и сотрудников",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}