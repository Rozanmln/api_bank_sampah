const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const User = require("./user.js");
const Role = require("./role.js");

const { DataTypes } = Sequelize;

const UserRole = db.define(
  "user_role",
  {
    user_role_id: {
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
    role_id: {
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

User.hasMany(UserRole, {
  foreignKey: "user_id",
});
UserRole.belongsTo(User, {
  foreignKey: "user_id",
});

Role.hasMany(UserRole, {
  foreignKey: "role_id",
});
UserRole.belongsTo(Role, {
  foreignKey: "role_id",
});

module.exports = UserRole;
