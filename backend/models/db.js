/**
 * Модуль базы данных
 */
"use strict";
var Sequelize = require('sequelize'); // ORM

var db = {};
db = new Sequelize(`postgres://${process.env.PSYCHO_DB_USER}:${process.env.PSYCHO_DB_PWD}@${process.env.PSYCHO_DB_ADDR}:${process.env.PSYCHO_DB_PORT}/${process.env.PSYCHO_DB_DATABASE}`,
  {
    // логирование всех запросов в консоль для продакшена отключим
    logging: process.env.NODE_ENV === "production" ? false : console.log
  });
// таблицы бд
db.articles = db.import('./libraryArticle.js'); // статьи библиотеки
db.libCats = db.import('./libraryCategory.js'); // категории статей

module.exports = db;