const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const UnitOfMeasurement = require("./unitOfMeasurement.js");
const Category = require("./category.js");

const { DataTypes } = Sequelize;

const Item = db.define(
  "item",
  {
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    item_name: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    category_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    price: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    unit_of_measurement_id: {
      type: DataTypes.INTEGER,
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

UnitOfMeasurement.hasMany(Item, {
  foreignKey: "unit_of_measurement_id",
});
Item.belongsTo(UnitOfMeasurement, {
  foreignKey: "unit_of_measurement_id",
});

Category.hasMany(Item, {
  foreignKey: "category_id",
});
Item.belongsTo(Category, {
  foreignKey: "category_id",
});

module.exports = Item;
