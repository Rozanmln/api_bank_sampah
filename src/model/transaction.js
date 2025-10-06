const { Sequelize } = require('sequelize');
const db = require('../config/database.js');
const User = require("./user.js");
const GarbageBank = require("./garbageBank.js");

const { DataTypes } = Sequelize;

const Transaction = db.define(
  "transaction",
  {
    transaction_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
      validate: {
        notEmpty: true,
      },
    },
    user_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    garbage_bank_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    phone_number: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    customer: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    number_of_customer_weighing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    date_of_weighing: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_price: {
      type: DataTypes.DECIMAL(10, 3),
      allowNull: false,
      validate: {
        notEmpty: true,
      },
    },
    total_weight: {
      type: DataTypes.DECIMAL(10, 3),
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

User.hasMany(Transaction, {
  foreignKey: "user_id",
});
Transaction.belongsTo(User, {
  foreignKey: "user_id",
});

GarbageBank.hasMany(Transaction, {
  foreignKey: "garbage_bank_id",
});
Transaction.belongsTo(GarbageBank, {
  foreignKey: "garbage_bank_id",
});

module.exports = Transaction;