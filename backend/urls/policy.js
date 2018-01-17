exports.render = (req, res) => {
  let model = {
    path: req.path,
    title: 'Политика конфиденциальности'
  };
  res.render(`.${req.path}.html`, model);
};
