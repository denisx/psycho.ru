/**
 * Модуль базы данных
 */
"use strict";
var Sequelize = require('sequelize'); // ORM

let connectionString = `postgres://${process.env.PSYCHO_DB_USER}@${process.env.PSYCHO_DB_ADDR}:${process.env.PSYCHO_DB_PORT}/${process.env.PSYCHO_DB_DATABASE}`;

if(process.env.PSYCHO_DB_PASS) {
  connectionString = `postgres://${process.env.PSYCHO_DB_USER}:${process.env.PSYCHO_DB_PASS}@${process.env.PSYCHO_DB_ADDR}:${process.env.PSYCHO_DB_PORT}/${process.env.PSYCHO_DB_DATABASE}`;
}

var db = {};
db = new Sequelize(connectionString,
  {
    // логирование всех запросов в консоль для продакшена отключим
    logging: process.env.NODE_ENV === "production" ? false : console.log
  });
// таблицы бд
db.articles = db.import('./libraryArticle.js'); // статьи библиотеки
db.libCats = db.import('./libraryCategory.js'); // категории статей

module.exports = db;