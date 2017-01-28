"use strict";

module.exports = function(sequelize, Datatypes) {
    return sequelize.define('article', {
        id: {
            primaryKey: true,
            type: Datatypes.INTEGER,
            autoIncrement: true
        },
        category: {
            type: Datatypes.INTEGER,
            defaultValue: 5
        },
        title: {
            type: Datatypes.STRING(200),
            allowNull: false
        },
        link: {
            type: Datatypes.STRING(100),
            allowNull: false
        },
        shortDesc: Datatypes.TEXT,
        intro: Datatypes.TEXT,
        author: Datatypes.TEXT,
        body: {
            type: Datatypes.TEXT,
            allowNull: false
        },
        keywords: Datatypes.STRING(255),
        description: Datatypes.STRING(350)
    }, {
        freezeTableName: true,
        tableName: 'library_articles',
        paranoid: true
    });
} 