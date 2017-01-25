exports.render = (req, res) => {
  var model = {
      title: "Психология и бизнес",
      path: req.path
    };
    res.render("index.html", model);
}