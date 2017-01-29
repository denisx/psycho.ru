/**
 * Модель таблицы категорий статей библиотеки
 */
"use strict";

module.exports = function(sequelize, Datatypes) {
  return sequelize.define('libraryCategory', {
  // поля
  id: {
    primaryKey: true,
    type: Datatypes.INTEGER,
    autoIncrement: true
  },
  link: Datatypes.STRING(50), // ссылка
  name: Datatypes.STRING(50)  // название
  }, 
  // опции
  {
    freezeTableName: true,
    tableName: 'library_categories',
    timestamps: false,
    paranoid: true
  });
} 