const { Sequelize } = require('sequelize');
const db = require('../config/database.js');
const Transaction = require("./transaction.js");
const Item = require("./item.js");

const { DataTypes } = Sequelize;

const TransactionItem = db.define(
  "transaction_item",
  {
    transaction_item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    item_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    weight: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_price: {
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

Transaction.hasMany(TransactionItem, {
  foreignKey: "transaction_id",
});
TransactionItem.belongsTo(Transaction, {
  foreignKey: "transaction_id",
});

Item.hasMany(TransactionItem, {
  foreignKey: "item_id",
});
TransactionItem.belongsTo(Item, {
  foreignKey: "item_id",
});

module.exports = TransactionItem;