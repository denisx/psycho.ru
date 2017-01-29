/**
 * Таблица статей библиотеки
 */
"use strict";

module.exports = function(sequelize, Datatypes) {
  return sequelize.define('article', {
  // поля
  id: {
    primaryKey: true,
    type: Datatypes.INTEGER,
    autoIncrement: true
  },
  category: { // id категории
    type: Datatypes.INTEGER,
    defaultValue: 5
  },
  title: {  // заголовок
    type: Datatypes.STRING(200),
    allowNull: false
  },
  link: { // ссылка
    type: Datatypes.STRING(100),
    allowNull: false
  },
  shortDesc: Datatypes.TEXT,  // краткое описание
  intro: Datatypes.TEXT,  // вступление
  author: Datatypes.TEXT, // автор
  body: { // текст
    type: Datatypes.TEXT,
    allowNull: false
  },
  createdAt: Datatypes.DATE,  // дата создания
  keywords: Datatypes.STRING(255),  // сео - ключевые слова
  description: Datatypes.STRING(350)  // сео - описание
  },
  // опции 
  {
    freezeTableName: true,
    tableName: 'library_articles',
    paranoid: true
  });
} 