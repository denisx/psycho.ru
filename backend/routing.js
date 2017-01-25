exports.appRouter = (req, res, next) => {
  let modulePath = "./pages" + req.path;
  if(req.path === "/") {
    modulePath = "./pages/main";
  }

  try {
      require(modulePath).render(req, res);
  }
  catch(ex) {
    next();
  }
}