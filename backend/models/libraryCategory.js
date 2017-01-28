"use strict";

module.exports = function(sequelize, Datatypes) {
    return sequelize.define('libraryCategory', {
        id: {
            primaryKey: true,
            type: Datatypes.INTEGER,
            autoIncrement: true
        },
        link: Datatypes.STRING(50),
        name: Datatypes.STRING(50)
    }, {
        freezeTableName: true,
        tableName: 'library_categories',
        timestamps: false,
        paranoid: true
    });
} 