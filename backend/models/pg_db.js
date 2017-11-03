/**
 * Модуль подключения к PostgreSQL
 * Использует глобальный пулл соединений к БД
 * Все параметры подключения берутся из переменных окружения
 */
'use strict';
let pg = require('pg'),
  config = {
    database: process.env.PSYCHO_DB_DATABASE, // база данных
    host: process.env.PSYCHO_DB_ADDR, // адрес БД
    // idleTimeoutMillis: process.env.PSYCHO_DB_CTO, // время жизни соединения в простое
    // max: process.env.PSYCHO_DB_MAXC, // максимальное количество соединений
    password: process.env.PSYCHO_DB_PASS, // пароль пользоватлея
    port: process.env.PSYCHO_DB_PORT, // порт
    user: process.env.PSYCHO_DB_USER, // имя пользователя
  },
  pgPool = new pg.Pool(config); // инстанс

pgPool.on('error', function (err) { // хэндлер ошибок пулера
  console.error('db: idle client error', err.message, err.stack);
});

module.exports = exports = {
  /**
   * Выполнение SQL запроса с опциональными параметрами
   */
  execute: (text, values) => pgPool.query(text, values),

  /**
   * функция генерации даты/времени для вставки в бд
   * входной формат даты дд.мм.гггг чч:мм:сс
   */
  getFormatedDateTime: (d) => {
    let fd = d.split(' ')[0].split('.');
    return `${fd[2]}-${fd[1]}-${fd[0]} ${d.split(' ')[1]}`;
  },

  /**
   * Пул соединений приложения
   */
  pool: pgPool,
};
