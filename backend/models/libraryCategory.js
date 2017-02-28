/**
 * Модель таблицы категорий статей библиотеки
 */
'use strict';

module.exports = function(sequelize, Datatypes) {
  return sequelize.define('libraryCategory', {
  // поля
    id: {
      autoIncrement: true,
      primaryKey: true,
      type: Datatypes.INTEGER,
    },
    link: Datatypes.TEXT(), // ссылка
    name: Datatypes.TEXT()  // название
  },
    // опции
    {
      freezeTableName: true,
      paranoid: true,
      tableName: 'library_categories',
      timestamps: false,
    }
  );
};
