// models/SubTask.js
const { DataTypes } = require('sequelize');
//const { sequelize } = require('.');
// const sequelize = require('../configuration/database');

module.exports = (sequelize, DataTypes) => {
    const SubTask = sequelize.define('SubTask', {
        id: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        task_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Tasks',
                key: 'id'
            }
        },
        status: {
            type: DataTypes.ENUM('0','1'),
            defaultValue: '0'
        },
        created_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        updated_at: {
            type: DataTypes.DATE,
            allowNull: false,
            defaultValue: DataTypes.NOW
        },
        deleted_at: {
            type: DataTypes.DATE
        }
    }, {
        timestamps: false,
        paranoid: true, // Soft deletion
        underscored: true // Use snake_case for column names
        
    });


    return SubTask;

}
