exports.seoRedirector = (req, res, next) => {
  var fullUrl = req.get('host') + req.originalUrl;
  // удаление "/" в конце + 301
  if(/(.+)\/$/.test(req.originalUrl)) {
    return res.redirect(301, `${req.protocol}://${fullUrl.slice(0, -1)}`);
  }
  // добавление www
  else if(!/^www\./.test(req.headers.host)) {
    return res.redirect(301, `${req.protocol}://www.${fullUrl}`);
  }
  else return next();
}