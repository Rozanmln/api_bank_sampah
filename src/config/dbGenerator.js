const db = require('./database');
const User = require("../model/user");
const UserRole = require("../model/userRole");
const Role = require("../model/role");
const RolePrivilege = require("../model/rolePrivilege");
const Privilege = require("../model/privilege");
const GarbageBank = require("../model/garbageBank");
const Transaction = require("../model/transaction");
const TransactionItem = require("../model/transactionItem");
const Item = require("../model/item");
const UnitOfMeasurement = require("../model/unitOfMeasurement");
const Category = require("../model/category");

const dbGenerate = async () => {
  try {
    await db.sync();
    console.log("Connection has been established successfully.");

  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
};

// module.exports = dbGenerate;
dbGenerate();