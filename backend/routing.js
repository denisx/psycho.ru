exports.appRouter = (req, res, next) => {
  let rootPath = "./urls";
  let modulePath = `${rootPath}${req.path}`;
  if(req.path === "/") {
    modulePath = `${rootPath}/index`;
  }

  try {
      require(modulePath).render(req, res);
  }
  catch(ex) {
    next();
  }
}