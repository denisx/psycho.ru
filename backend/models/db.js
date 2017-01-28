var Sequelize = require('sequelize');
var cfg = require(`${process.cwd()}/config.json`);

var db = {};
db = new Sequelize(`postgres://${cfg.db.user}:${cfg.db.pass}@${cfg.db.host}:${cfg.db.port}/${cfg.db.database}`,
  {
    logging: process.env.NODE_ENV === "production" ? false : true
  });
db.articles = db.import('./libraryArticle.js');

module.exports = db;