'use strict';

const router = require('express').Router(),
  crypto = require('crypto'),
  auth = require('./lib_auth');

module.exports = router;

function createHashString(password, salt) {
  return new Promise((resolve, reject) => {
    let iterations = 50000,
      keylen = 128;
    crypto.pbkdf2(password, salt, iterations, keylen, 'sha512', (err, key) => {
      if(err) { return reject(err); }
      return resolve(key.toString('hex'));
    });
  });
}

router.route('/login')
.get((req, res) => {
  res.render('./admin/login.html', {});
})
.post((req, res, next) => { // обработка запроса аутентификации
  let
    password = req.body.password,
    login = req.body.login,
    ru = req.body.ru;
  // хэш полученного пароля
  createHashString(password, process.env.PSYCHO_SALT)
  // попытка аутентификации
  .then(hash => auth.login(res, login, hash))
  .then(isAuth => {
    if(isAuth) { // аутентификация удачна
      if(!ru) { // адрес возврата не указан
        ru = '/admin/library';
      }
      res.redirect(ru); // редикрект по адресу возврата
    }
    else { // креды кривые
      res.render('./admin/login.html', {
        email: login,
        error: true,
      });
    }
  })
  .catch(e => {
    console.error(e);
    next(e);
  });
});
