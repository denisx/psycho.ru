exports.render = (req, res) => {
  var model = {
    title: "О компании",
    path: req.path,
    year: new Date().getFullYear()
  };
  res.render("about.html", model);
}