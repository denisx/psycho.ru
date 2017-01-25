exports.appRouter = (req, res, next) => {
  let modulePath = "./backend/urls" + req.path;
  if(req.path === "/") {
    modulePath = "./backend/urls/index";
  }

  try {
      require(modulePath).render(req, res);
  }
  catch(ex) {
    next();
  }
}