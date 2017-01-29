exports.seoRedirector = (req, res, next) => {
  var fullUrl = req.get('host') + req.originalUrl;
  // переменная, содержащая запрос без get-параметров и начального /
  // сделана для удобства набора правил и краткости
  var p = req.path.replace(/^\//, '');

  // функция-алиас с 301 редиректом
  // сделана для удобства набора правил и краткости
  var r = function(url) {
    if(url === '') return next();
    return res.redirect(301, `${req.protocol}://${req.get('host')}/${url}`);
  }

  // удаление "/" в конце + 301
  if(/(.+)\/$/.test(p))
    return res.redirect(301, `${req.protocol}://${fullUrl.slice(0, -1)}`);
  // добавление www
  if(!/^www\./.test(req.headers.host))
    return res.redirect(301, `${req.protocol}://www.${fullUrl}`);

  /**
   * Редиректы, оставшиеся с сайта 1 и 2 версии.
   */
  if(/^(contacts|partners)$/.test(p)) return r('about');
  if(/^products\/177$/.test(p)) return r('products/corpcult/study_of_corpcult');
  if(/$^/.test(p)) return r('');
  /**
   * Редиректы сайта 3 и 4 версии.
   */
  if(/^products\/corpcult\/study_of_corpcult$/.test(p)) return r('products/corpcult');
  return next();
}