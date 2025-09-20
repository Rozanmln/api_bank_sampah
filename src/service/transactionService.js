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
        "total_price",
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

    const parsedTransaction = transaction.map(t => ({
      ...t,
      total_price: t.total_price === null ? null : parseFloat(t.total_price),
    }));

    for (let i = 0; i < parsedTransaction.length; i++) {
        let single_transaction = {}
        let items_arr = []

        single_transaction = parsedTransaction[i];

        const transaction_item = await TransactionItem.findAll({
            attributes: [
                "transaction_item_id", 
                "transaction_id", 
                "item_id", 
                "weight", 
                "price_per_qty",
                "amount"
            ],
            where: {
                transaction_id: parsedTransaction[i].transaction_id,
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
                weight: parseFloat(transaction_item[j].weight),
                price_per_qty: parseFloat(transaction_item[j].price_per_qty),
                amount: parseFloat(transaction_item[j].amount),
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

  async getTransactionDetail(id) {
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
        "total_price",
      ],
      where: {
        transaction_id: id,
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

    const parsedTransaction = transaction.map(t => ({
      ...t,
      total_price: t.total_price === null ? null : parseFloat(t.total_price),
    }));

    for (let i = 0; i < parsedTransaction.length; i++) {
        let single_transaction = {}
        let items_arr = []

        single_transaction = parsedTransaction[i];

        const transaction_item = await TransactionItem.findAll({
            attributes: [
                "transaction_item_id", 
                "transaction_id", 
                "item_id", 
                "weight", 
                "price_per_qty",
                "amount"
            ],
            where: {
                transaction_id: parsedTransaction[i].transaction_id,
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
                weight: parseFloat(transaction_item[j].weight),
                price_per_qty: parseFloat(transaction_item[j].price_per_qty),
                amount: parseFloat(transaction_item[j].amount),
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

  async getTransactionByUser(value) {
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
        "total_price",
      ],
      where: {
        user_id: value.user_id,
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

    const parsedTransaction = transaction.map(t => ({
      ...t,
      total_price: t.total_price === null ? null : parseFloat(t.total_price),
    }));

    for (let i = 0; i < parsedTransaction.length; i++) {
        let single_transaction = {}
        let items_arr = []

        single_transaction = parsedTransaction[i];

        const transaction_item = await TransactionItem.findAll({
            attributes: [
                "transaction_item_id", 
                "transaction_id", 
                "item_id", 
                "weight", 
                "price_per_qty",
                "amount"
            ],
            where: {
                transaction_id: parsedTransaction[i].transaction_id,
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
                weight: parseFloat(transaction_item[j].weight),
                price_per_qty: parseFloat(transaction_item[j].price_per_qty),
                amount: parseFloat(transaction_item[j].amount),
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

  async createTransaction(value) {
    const items = value.items;
    let total_price_data = 0;

    if (items.length > 0) {
      total_price_data = items.reduce((sum, item) => sum + item.amount, 0);
    }

    const transaction = await Transaction.create({
      user_id: value.user_id,
      garbage_bank_id: value.garbage_bank_id,
      phone_number: value.phone_number,
      customer: value.customer,
      number_of_customer_weighing: value.number_of_customer_weighing,
      date_of_weighing: value.date_of_weighing,
      total_price: total_price_data,
    });

    if (items.length > 0) {
        for (let i = 0; i < items.length; i++) {
            await TransactionItem.create({
                transaction_id: transaction.transaction_id,
                item_id: items[i].item_id,
                weight: items[i].weight,
                price_per_qty: items[i].price_per_qty,
                amount: items[i].amount,
            });
        }
    }

    return transaction
  }

  async updateTransaction(value) {
    const items = value.items;
    let total_price_data = 0;

    if (items.length > 0) {
      total_price_data = items.reduce((sum, item) => sum + item.amount, 0);
    }

    const foundTransaction = await Transaction.findOne({
      where: {
        transaction_id: value.transaction_id,
        deleted_at: null,
      },
    });
    if (!foundTransaction) {
      throw new NotFound("\Transaction not found");
    }

    const [count, rows] = await Transaction.update(
      {
        user_id: value.user_id,
        garbage_bank_id: value.garbage_bank_id,
        phone_number: value.phone_number,
        customer: value.customer,
        number_of_customer_weighing: value.number_of_customer_weighing,
        date_of_weighing: value.date_of_weighing,
        total_price: total_price_data,
      },
      {
        where: { transaction_id: value.transaction_id },
        returning: true,
      }
    );

    if (items.length > 0) {
      await TransactionItem.destroy(
        {
          where: { transaction_id: value.transaction_id }
        }
      )

      for (let i = 0; i < items.length; i++) {
        await TransactionItem.create({
          transaction_id: value.transaction_id,
          item_id: items[i].item_id,
          weight: items[i].weight,
          price_per_qty: items[i].price_per_qty,
          amount: items[i].amount,
        });
      }
    }

    return rows[0]
  }

  async deleteTransaction(id) {
    const foundTransaction = await Transaction.findOne({
      where: {
        transaction_id: id,
        deleted_at: null,
      },
    });
    if (!foundTransaction) {
      throw new NotFound("Transaction not found");
    }

    const now = new Date();

    const [count, rows] = await Transaction.update(
      {
        deleted_at: now
      },
      {
        where: { transaction_id: id },
        returning: true,
      }
    );

    return rows[0]
  }

}

module.exports = TransactionService;
