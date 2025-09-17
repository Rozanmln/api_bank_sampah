const { Sequelize } = require('sequelize');
const db = require('../config/database.js');

const { DataTypes } = Sequelize;

const UnitOfMeasurement = db.define(
  "unit_of_measurement",
  {
    unit_of_measurement_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    unit_of_measurement_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    deleted_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },
  },
  {
    freezeTableName: true,
    timestamps: true,
  }
);

module.exports = UnitOfMeasurement;