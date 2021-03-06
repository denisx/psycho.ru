exports.render = (req, res) => {
  let model = {
    description: 'Поможем вам раскрыть потенциал организации, повысить продуктивность, результативность и другие бизнес показатели за счёт воздействия на психологические факторы — на мотивацию, вовлечённость и лидерство её руководителей и сотрудников',
    keywords: 'корпоративное обучение и тренинги, бизнес тренинги',
    path: req.path,
    title: 'О компании',
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
};
