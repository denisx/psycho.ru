/**
 * Таблица статей библиотеки
 */
'use strict';

module.exports = function(sequelize, Datatypes) {
  return sequelize.define('article', {
    // поля
    author: Datatypes.TEXT, // автор
    body: { // текст
      allowNull: false,
      type: Datatypes.TEXT,
    },
    category: { // id категории
      defaultValue: 5,
      type: Datatypes.INTEGER,
    },
    date_create: Datatypes.DATE, // дата создания
    description: Datatypes.TEXT(), // сео - описание
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Datatypes.INTEGER,
    },
    intro: Datatypes.TEXT, // вступление
    keywords: Datatypes.TEXT(), // сео - ключевые слова
    link: { // ссылка
      allowNull: false,
      type: Datatypes.TEXT(),
    },
    short_descr: Datatypes.TEXT, // краткое описание
    title: { // заголовок
      allowNull: false,
      type: Datatypes.TEXT(),
    },
    title_image_url: {
      type: Datatypes.TEXT(),
    },
  },
  // опции
  {
    createdAt: 'date_create',
    deletedAt: 'date_delete',
    freezeTableName: true,
    paranoid: true,
    tableName: 'library_articles',
    timestamps: true,
    updatedAt: 'date_update',
  });
};
