const db = require('../config/database');
const Privilege = require("../model/privilege");
const Role = require("../model/role");
const RolePrivilege = require("../model/rolePrivilege");
const UnitOfMeasurement = require("../model/unitOfMeasurement");

const seed = async () => {
  try {
    await db.sync();

    const count_privilege = await Privilege.count();
    if (count_privilege === 0) {
      await Privilege.bulkCreate([
        {
            privilege_name: "CREATE_TRANSACTION",
            description: "user allow to create transaction",
            deleted_at: null,
        },
        {
            privilege_name: "READ_TRANSACTION",
            description: "user allow to read transaction",
            deleted_at: null,
        },
        {
            privilege_name: "UPDATE_TRANSACTION",
            description: "user allow to update transaction",
            deleted_at: null,
        },
        {
            privilege_name: "DELETE_TRANSACTION",
            description: "user allow to delete transaction",
            deleted_at: null,
        },
        {
            privilege_name: "CREATE_ITEM",
            description: "user allow to create item",
            deleted_at: null,
        },
        {
            privilege_name: "READ_ITEM",
            description: "user allow to read item",
            deleted_at: null,
        },
        {
            privilege_name: "UPDATE_ITEM",
            description: "user allow to update item",
            deleted_at: null,
        },
        {
            privilege_name: "DELETE_ITEM",
            description: "user allow to delete item",
            deleted_at: null,
        },
        {
            privilege_name: "CREATE_CATEGORY",
            description: "user allow to create category",
            deleted_at: null,
        },
        {
            privilege_name: "READ_CATEGORY",
            description: "user allow to read category",
            deleted_at: null,
        },
        {
            privilege_name: "UPDATE_CATEGORY",
            description: "user allow to update category",
            deleted_at: null,
        },
        {
            privilege_name: "DELETE_CATEGORY",
            description: "user allow to delete category",
            deleted_at: null,
        },
      ]);
    }

    const count_role = await Role.count();
    if (count_role === 0) {
        await Role.bulkCreate([
            {
                role_name: "Admin",
                description: "Admin garbage bank",
                deleted_at: null,
            },
            {
                role_name: "User",
                description: "User that input transaction",
                deleted_at: null,
            },
        ]);
    }

    const count_role_privilege = await RolePrivilege.count();
    if (count_role_privilege === 0) {
        await RolePrivilege.bulkCreate([
            {
                role_id: 1,
                privilege_id: 1,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 2,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 3,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 4,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 5,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 6,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 7,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 8,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 9,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 10,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 11,
                deleted_at: null,
            },
            {
                role_id: 1,
                privilege_id: 12,
                deleted_at: null,
            },
            {
                role_id: 2,
                privilege_id: 1,
                deleted_at: null,
            },
            {
                role_id: 2,
                privilege_id: 2,
                deleted_at: null,
            },
            {
                role_id: 2,
                privilege_id: 6,
                deleted_at: null,
            },
            {
                role_id: 2,
                privilege_id: 10,
                deleted_at: null,
            },
        ]);
    }

    const count_uom = await UnitOfMeasurement.count();
    if (count_uom === 0) {
        await UnitOfMeasurement.bulkCreate([
            {
                unit_of_measurement_name: "Kg",
                deleted_at: null,
            },
            {
                unit_of_measurement_name: "Pcs/Satuan",
                deleted_at: null,
            },
        ]);
    }

    console.log("Seeding finished.");
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
};

seed();
