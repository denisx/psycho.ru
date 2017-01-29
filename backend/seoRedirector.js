exports.seoRedirector = (req, res, next) => {
  var fullUrl = req.get('host') + req.originalUrl;
  // переменная, содержащая запрос без get-параметров и начального /
  // сделана для удобства набора правил и краткости
  var p = req.path.replace(/^\//, '');

  // функция-алиас с 301 редиректом
  // сделана для удобства набора правил и краткости
  var r = function(url) {
    if(url === '') return res.redirect(301, `${req.protocol}://${req.get('host')}`);
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
  // редиректы на страницу "О компании"
  if(/^(contacts|partners)$/.test(p)) 
    return r('about');
  // -----
  if(/^products\/177$/.test(p)) return r('products/corpcult');
  // редиректы на страницу продукта "Оценка"
  if(/^(events\/117|products\/(122|119[\/\d\w]*|125[\/\d\w]*|170))$/.test(p)) 
    return r('products/assessment');
  // -----
  // редиректы на страницу продукта "Вовлеченность"
  if(/^(products\/155|products\/consulting)$/.test(p)) 
    return r('products/involvement');
  // -----
  // редиректы на страницу продукта "Полезные привычки"
  if(/^products\/185|products\/113[\/\d\w]*$/.test(p)) 
    return r('products/keyhabits');
  // -----
  // редиректы на индексную страницу библиотеки
  if(/^mag|test|tags\/(.+)|library\/(all|managment\/communication|library\.aspx[\w_\d\?=\.]*)|biblio\/(\-|management\/communication|technologies|advert[\/\w_\d\?=\.]*|manag(e)?ment[\/\w_\d\?=\.]*|technologies[\/\w_\d\?=\.]*)$/.test(p)) 
    return r('library');
  // -----
  if(/^biblio\/advert\/creative\/nebesny_epotaz$/.test(p)) 
    return r('library/1470');
  if(/^biblio\/hr\/motivation\/sosed_vasya$/.test(p)) 
    return r('library/109');
  if(/^biblio\/management\/system\/vorovka_prodaz$/.test(p)) 
    return r('library/2456');
  if(/^biblio\/hr\/motivation\/opcion$/.test(p)) 
    return r('library/2455');
  if(/^biblio\/advert\/mass\/telenasilie$/.test(p)) 
    return r('library/519');
  if(/^biblio\/management\/system\/ispolnenie_jelaniy$/.test(p)) 
    return r('library/681');
  if(/^library\/[\w_]+\/[\w_\/]+\/(\d{1,4})$/.test(p)) {
    var id = /^library\/[\w_]+\/[\w_\/]+\/(\d{1,4})$/.exec(p)[1];
    return r(`library/${id}`);
  }
  if(/^biblio\/technologies\/events\/konfer_sobchik$/.test(p)) 
    return r('library/954');
  if(/^biblio\/technologies\/theory\/zakon_muhi$/.test(p)) 
    return r('library/1535');
  if(/^biblio\/advert\/research\/perevod_reklamy$/.test(p)) 
    return r('library/189');
  if(/^biblio\/advert\/btl\/sport_pr$/.test(p)) 
    return r('library/952');
  if(/^biblio\/technologies\/theory\/porcha$/.test(p)) 
    return r('library/31');
  if(/^biblio\/advert\/brend\/2_prishestvie$/.test(p)) 
    return r('library/559');
  if(/^biblio\/advert\/brend\/branding_podrostki$/.test(p)) 
    return r('library/635');
  if(/^biblio\/advert\/brend\/detsky_brending$/.test(p)) 
    return r('library/999');
  if(/^biblio\/advert\/brend\/gvozd_ris$/.test(p))
    return r('library/457');
  if(/^biblio\/advert\/brend\/igry_cveta$/.test(p))
    return r('library\1895');
  if(/^biblio\/advert\/brend\/imya_privlekatelnoe$/.test(p))
    return r('library\647');
  if(/^biblio\/hr[\/\w_\d\?=\.]*|library\/hr\/motivation$/.test(p))
    return r('library/assessment');
  if(/^biblio\/politica[\/\w_\d\?=\.]*$/.test(p))
    return r('library/ideology');
  if(/^shop\/professor|programm\/(prof|vaal)|products\/(115|soft\/professor_kadry|116[/\d\w]*)$/.test(p))
    return r('products/assessment/professor');
  if(/^shop|expert|events|trn[\/\w_\d\?=\.]*|seminars[\/\w_\d\?=\.]*|training(s)?|marketing|consulting|soft|products\/(124|123|114|178|120|148|121|145|117|161|169|129|127|137|146|trainings|all|events|consalting|valuation)$/.test(p))
    return r('#productPage');
  if(/^go\.php|forum|voting|trainers|subscribe|prog|registration|rss|catlinks\.php|links|themes|discussions|index\.html|papers|blogs|konkurs|fulltext\/jar\/images\/9146a|clients|coaching|face|feedback|leadership$/.test(p))
    return r('');
  // if(/^$/.test(p))return r('');
  /**
   * Редиректы сайта 3 и 4 версии.
   */
  if(/^products\/corpcult\/study_of_corpcult$/.test(p)) 
    return r('products/corpcult');
  if(/^products\/involvement\/involvement_research$/.test(p)) 
    return r('products/involvement');
  if(/^products\/individual_development\/motivation$/.test(p)) 
    return r('products/keyhabits/motivation');
  if(/^products\/individual_development$/.test(p))
    return r('products/keyhabits');
  if(/^products$/.test(p))
    return r('#productPage');
  // if(/^$/.test(p))return r('');
  return next();
}