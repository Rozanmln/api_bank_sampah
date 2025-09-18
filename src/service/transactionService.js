const { Op, where, Sequelize } = require("sequelize");
const Transaction = require("../model/transaction");
const TransactionItem = require("../model/transactionItem");
const Item = require("../model/item");
const User = require("../model/user");
const GarbageBank = require("../model/garbageBank");
const Category = require("../model/category");
const UnitOfMeasurement = require("../model/unitOfMeasurement");
const { NotFound } = require("../utils/response");

class TransactionService {

  async getTransaction() {
    let responseData = [];

    const transaction = await Transaction.findAll({
      attributes: [
        "transaction_id", 
        "user_id", 
        [Sequelize.col("user.username"), "username"],
        "garbage_bank_id", 
        [Sequelize.col("garbage_bank.garbage_bank_name"), "garbage_bank_name"],
        "phone_number", 
        "customer",
        "number_of_customer_weighing",
        "date_of_weighing",
      ],
      where: {
        deleted_at: null,
      },
      include: [
        {
          model: User,
          as: "user",
          attributes: [],
          required: true,
        },
        {
          model: GarbageBank,
          as: "garbage_bank",
          attributes: [],
          required: true,
        },
      ],
      raw: true,
    });

    for (let i = 0; i < transaction.length; i++) {
        let single_transaction = {}
        let items_arr = []

        single_transaction = transaction[i];

        const transaction_item = await TransactionItem.findAll({
            attributes: [
                "transaction_item_id", 
                "transaction_id", 
                "item_id", 
                "weight", 
                "total_price"
            ],
            where: {
                transaction_id: transaction[i].transaction_id,
                deleted_at: null,
            },
            raw: true,
        });

        for (let j = 0; j < transaction_item.length; j++) {
            let item = await Item.findOne({
                attributes: [
                    "item_id", 
                    "item_name", 
                    "price", 
                    "category_id", 
                    "unit_of_measurement_id",
                    [Sequelize.col("category.category_name"), "category_name"],
                    [Sequelize.col("unit_of_measurement.unit_of_measurement_name"), "unit_of_measurement_name"],
                ],
                where: {
                    item_id: transaction_item[j].item_id,
                    deleted_at: null,
                },
                include: [
                    {
                    model: Category,
                    as: "category",
                    attributes: [],
                    required: true,
                    },
                    {
                    model: UnitOfMeasurement,
                    as: "unit_of_measurement",
                    attributes: [],
                    required: true,
                    },
                ],
                raw: true,
            });

            item = {
                ...item,
                weight: transaction_item[j].weight,
                total_price: transaction_item[j].total_price,
            }

            items_arr.push(item)
        }

        single_transaction = {
            ...single_transaction,
            items: items_arr
        };

        responseData.push(single_transaction);
    }
    
    return responseData
  }

//   async getItemByCategory(value) {
//     let responseData = {};

//     const item = await Item.findAll({
//       attributes: [
//         "item_id",
//         "item_name",
//         "price",
//         "category_id",
//         "unit_of_measurement_id",
//         [Sequelize.col("category.category_name"), "category_name"],
//         [Sequelize.col("unit_of_measurement.unit_of_measurement_name"), "unit_of_measurement_name"],
//       ],
//       where: {
//         category_id: value.category_id,
//         deleted_at: null,
//       },
//       include: [
//         {
//           model: Category,
//           as: "category",
//           attributes: [],
//           required: true,
//         },
//         {
//           model: UnitOfMeasurement,
//           as: "unit_of_measurement",
//           attributes: [],
//           required: true,
//         },
//       ],
//       raw: true,
//     });

//     responseData = item

//     return responseData
//   }

  async createTransaction(value) {
    const transaction = await Transaction.create({
      user_id: value.user_id,
      garbage_bank_id: value.garbage_bank_id,
      phone_number: value.phone_number,
      customer: value.customer,
      number_of_customer_weighing: value.number_of_customer_weighing,
      date_of_weighing: value.date_of_weighing,
    });

    const items = value.items;

    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            await TransactionItem.create({
                transaction_id: transaction.transaction_id,
                item_id: items[i].item_id,
                weight: items[i].weight,
                total_price: items[i].total_price,
            });
        }
    }

    return transaction
  }

//   async updateItem(value) {
//     const foundItem = await Item.findOne({
//       where: {
//         item_id: value.item_id,
//       },
//     });
//     if (!foundItem) {
//       throw new NotFound("Item not found");
//     }

//     const [count, rows] = await Item.update(
//       {
//         item_name: value.item_name,
//         price: value.price,
//         category_id: value.category_id,
//         unit_of_measurement_id: value.unit_of_measurement_id,
//       },
//       {
//         where: { item_id: value.item_id },
//         returning: true,
//       }
//     );

//     return rows[0]
//   }

//   async deleteItem(id) {
//     const foundItem = await Item.findOne({
//       where: {
//         item_id: id,
//       },
//     });
//     if (!foundItem) {
//       throw new NotFound("Item not found");
//     }

//     const now = new Date();

//     const [count, rows] = await Item.update(
//       {
//         deleted_at: now
//       },
//       {
//         where: { item_id: id },
//         returning: true,
//       }
//     );

//     return rows[0]
//   }

}

module.exports = TransactionService;
