/**
 * Модуль аутентификации и авторизации
 */
'use strict';
const db = require('../../models/pg_db');

/**
 * Генератор времени жизни авторизационной куки
 */
function generateExpDate() {
  // время жизни куки по умолчанию 90 дней,
  const DAYS90 = 7776000000;
  return new Date(Date.now() + DAYS90);
}

module.exports = exports = {
  /**
   * Функция проверки аутентифицированности пользователя
   */
  isAuthenticated: (req) => {
    if(!req.cookies.auth) { return Promise.resolve(false); }
    // выбираем пользователя с указанным email из БД
    let query = `
        SELECT *
        FROM users
        WHERE LOWER(email) = LOWER($1);`,
      queryPars = [req.cookies.auth.email];
    return db.execute(query, queryPars)
      .then(u => {
        let user = u.rows[0];
        // хэши пароля не совпадают
        if(req.cookies.auth.pwdhash !== user.password) { return false; }
        // всё нормально
        req.user = user;
        return true;
      })
      .catch(e => {
        console.error(e);
        return false;
      });
  },

  /**
   * Вход
   */
  login: function (res, email, password) {
    return new Promise((resolve, reject) => {
      // для начала выберем пользователя из БД по указанному адресу
      let query = `
          SELECT *
          FROM users
          WHERE LOWER(email) = LOWER($1);`,
        queryPars = [email];
      db.execute(query, queryPars)
        .then(u => { // сверим его с выбранным из БД
          let user = u.rows[0], ck;
          if(!user || password !== user.password) {
            return resolve(false); // если не совпало, то досвидания
          }
          ck = { // соберём данные авторизационной куки
            email: email, // адрес почты
            id: user.id, // id пользователя
            pwdhash: user.password
          };
          res.cookie('auth', ck, { // отправим куку
            expires:  generateExpDate(),
            httpOnly: true,
            secure: Boolean(process.env.PSYCHO_HTTPS)
          });
          return resolve(true);
        })
        .catch(e => {
          console.error(e);
          reject(e);
        });
    });
  },

  /**
   * Миддл проверки авторизованности пользователя
   * если пользователь анонимный, происходит редирект на страницу логина
   * реализацию, при необходимости, можно сильно оптимизировать
   */
  need: function (req, res, next) {
    let redirectUrl = `/admin/auth/login?ru=${req.originalUrl}`,
      query = `
        SELECT *
        FROM users
        WHERE LOWER(email) = LOWER($1);`,
      queryPars = [req.cookies.auth.email];
    if(!req.cookies.auth) { // для начала выясним, есть ли авторизационная кука
      return res.redirect(redirectUrl);
    }
    // выбираем пользователя с указанным email из БД
    db.execute(query, queryPars)
      .then(u => {
        let user = u.rows[0];
        if(!user) { // пользователя нет в БД. сотрём куки
          return res.clearCookie('auth').redirect(redirectUrl);
        }
        // хэши пароля не совпадают, также стираем куки
        if(req.cookies.auth.pwdhash !== user.password) {
          return res.clearCookie('auth').redirect(redirectUrl);
        }
        // всё нормально
        req.user = user;
        return next();
      })
      .catch(e => next(e));
  },

  /**
   * Функция обновления expire авторизационной куки если она есть
   */
  refreshSession: function(req, res, next) {
    if(!req.cookies.auth) {
      return next();
    }
    res.cookie('auth', req.cookies.auth, {
      expires: generateExpDate(),
      httpOnly: true,
      secure: Boolean(process.env.PSYCHO_HTTPS)
    });
    return next();
  },
};
