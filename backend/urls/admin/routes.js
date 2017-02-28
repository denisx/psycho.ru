let passport = require('passport'),
  controllers = require('require-tree')('./controllers'),
  router = require('express').Router();

// middleware для проверки на авторизацию
router.route(['/admin/*', '/admin'])
  .get((req, res, next) => {
    if (req.originalUrl === '/admin') {
      return res.redirect('/admin/login');
    }

    if (req.isAuthenticated() || req.originalUrl === '/admin/login') {
      return next();
    }

    res.redirect('/admin/login');
  });

router.route(['/admin/login']) // рендер страницы авторизации
  .get((req, res) => {
    if (req.isAuthenticated()) {
      return res.redirect('/admin/library');
    }

    res.render('admin/views/login.html', {
      error: req.flash('error').toString(),
      mata: {title: 'Админ панель'}
    });
  })
  .post(passport.authenticate('local', { // выбор способа авторизации/ редиректы успешной и неудачной авторизации
    failureFlash: true,
    failureRedirect: '/admin/login',
    successRedirect: '/admin/library',
  }));

router.route('/admin/logout').get((req, res) => { req.logout(); res.redirect('/admin/login'); }); // logout

// вызов контроллера с рендером страниц библиотеки
router.route(['/admin/library', '/admin/library/page/:page?'])
  .get((req, res) => { controllers.library.index(req, res); });

router.route('/admin/library/edit/:id?') // вызов контроллера с рендером страниц редактирования страницы библиотеки
  .get((req, res) => { controllers.libraryEdit.edit(req, res); })
  .post((req, res) => { controllers.libraryEdit.editPost(req, res); });

module.exports = router;
