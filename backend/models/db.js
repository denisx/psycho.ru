/**
 * Модуль базы данных
 */
"use strict";
var Sequelize = require('sequelize'); // ORM
var cfg = require(`${process.cwd()}/config.json`);

var db = {};
db = new Sequelize(`postgres://${cfg.db.user}:${cfg.db.pass}@${cfg.db.host}:${cfg.db.port}/${cfg.db.database}`,
  {
    // логирование всех запросов в консоль для продакшена отключим
    logging: process.env.NODE_ENV === "production" ? false : console.log
  });
// таблицы бд
db.articles = db.import('./libraryArticle.js'); // статьи библиотеки
db.libCats = db.import('./libraryCategory.js'); // категории статей

module.exports = db;