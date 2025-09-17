const { Sequelize } = require("sequelize");
const db = require("../config/database.js");
const Role = require("./role.js");
const Privilege = require("./privilege.js");

const { DataTypes } = Sequelize;

const RolePrivilege = db.define(
  "role_privilege",
  {
    role_privilege_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
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
    privilege_id: {
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

Role.hasMany(RolePrivilege, {
  foreignKey: "role_id",
});
RolePrivilege.belongsTo(Role, {
  foreignKey: "role_id",
});

Privilege.hasMany(RolePrivilege, {
  foreignKey: "privilege_id",
});
RolePrivilege.belongsTo(Privilege, {
  foreignKey: "privilege_id",
});

module.exports = RolePrivilege;
