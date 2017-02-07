let passport       = require('passport');
let LocalStrategy  = require('passport-local').Strategy;
let db = require(`../../../models/db`);
let cfg = require(`${process.cwd()}/config.json`);

// настройки аутентификации
module.exports = function authentication(req, res, next) {
  passport.use('local', new LocalStrategy( // локальная стратегия
    function (username, password, done) {
      if (username == cfg.admin.username && password == cfg.admin.password) {
        return done(null, {
          id: 1,
          username: 'admin',
          name: 'Администратор'
        });
      }

      return done(null, false, 'Неверный логин или пароль');
    }
  ));

  // Serialize sessions
  passport.serializeUser(function(user, done) {
    done(null, user.id);
  });

  passport.deserializeUser(function(id, done) {
    done(null, {
      id: 1,
      username: 'admin',
      name: 'Администратор'
    });
  });

  next();
};
