exports.appRouter = (req, res, next) => {
  if(req.path === "/") {
    var model = {
      title: "Психология и бизнес",
      path: req.path
    };
    res.render("index.html", model);
  }
  else {
    next();
  }
}