exports.render = (req, res) => {
  let model = {
    path: req.path,
    title: 'Поиск по сайту',
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
};
