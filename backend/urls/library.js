exports.render = (req, res) => {
  var model = {
    title: "Библиотека",
    keywords: "",
    description: "",
    year: new Date().getFullYear()
  };
  res.render(`.${req.path}.html`, model);
}