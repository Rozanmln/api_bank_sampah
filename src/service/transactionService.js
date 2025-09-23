const { Sequelize } = require("sequelize");
const Transaction = require("../model/transaction");
const TransactionItem = require("../model/transactionItem");
const Item = require("../model/item");
const User = require("../model/user");
const GarbageBank = require("../model/garbageBank");
const Category = require("../model/category");
const UnitOfMeasurement = require("../model/unitOfMeasurement");
const { NotFound } = require("../utils/response");
const ExcelJS = require("exceljs");

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
  async transactionExportExcel(id) {
    let source_data = [];

    const transaction = await Transaction.findAll({
      attributes: [
        "transaction_id", 
        "user_id", 
        [Sequelize.col("user.username"), "username"],
        "garbage_bank_id", 
        [Sequelize.col("garbage_bank.garbage_bank_name"), "garbage_bank_name"],
        [Sequelize.col("garbage_bank.rw_name"), "rw_name"],
        [Sequelize.col("garbage_bank.address"), "address"],
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

        source_data.push(single_transaction);
    }

    const items = source_data[0].items.sort((a, b) => a.category_id - b.category_id);

    const date = new Date(source_data[0].date_of_weighing);

    const dateFormatted = new Intl.DateTimeFormat("id-ID", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      timeZone: "UTC"
    }).format(date);

    // create excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Transactions");

    // Add Title
    worksheet.mergeCells("A1:G1");
    const headerRow = worksheet.getCell("A1");
    headerRow.value = "Daftar Harga Bank Sampah Induk";
    headerRow.font = { bold: true, size: 14 };
    headerRow.alignment = { vertical: "middle", horizontal: "center" };

    // Empty row before table
    worksheet.addRow([]);

    // Add the information
    worksheet.mergeCells("A3:B3"); 
    const nama_bank_sampah = worksheet.getCell("A3");
    nama_bank_sampah.value = "Nama Bank Sampah";

    worksheet.mergeCells("A4:B4"); 
    const alamat = worksheet.getCell("A4");
    alamat.value = "Alamat dan No.HP";

    worksheet.mergeCells("A5:B5"); 
    const tanggal_penimbangan = worksheet.getCell("A5");
    tanggal_penimbangan.value = "Tanggal Penimbangan";

    const nama_bank_sampah_value = worksheet.getCell("C3");
    nama_bank_sampah_value.value = ": " + source_data[0].garbage_bank_name;

    const alamat_value = worksheet.getCell("C4");
    alamat_value.value = ": " + source_data[0].rw_name + " " + source_data[0].address;

    const tanggal_penimbangan_value = worksheet.getCell("C5");
    tanggal_penimbangan_value.value = ": " + dateFormatted;
    tanggal_penimbangan_value.alignment = { horizontal: "left" };

    worksheet.mergeCells("E3:F3"); 
    const jumlah_nasabah = worksheet.getCell("E3");
    jumlah_nasabah.value = "Jumlah Nasabah Penimbang";

    const jumlah_nasabah_value = worksheet.getCell("G3");
    jumlah_nasabah_value.value = ": " + source_data[0].number_of_customer_weighing;
    jumlah_nasabah_value.alignment = { horizontal: "left" };

    worksheet.addRow([]);

    // Add table header manually
    const tableHeader = ["No", "Jenis Barang", "", "Harga", "Satuan", "Timbangan", "Total Harga"];
    worksheet.addRow(tableHeader);
    worksheet.mergeCells("B7:C7");

    // Make table header bold
    worksheet.getRow(7).font = { bold: true };
    worksheet.getRow(7).alignment = { vertical: "middle", horizontal: "center" };

    // Adjust column widths
    worksheet.getColumn(1).width = 10;
    worksheet.getColumn(2).width = 20;
    worksheet.getColumn(3).width = 60;
    worksheet.getColumn(4).width = 20;
    worksheet.getColumn(5).width = 20;
    worksheet.getColumn(6).width = 20;
    worksheet.getColumn(7).width = 20;

    // Add transaction rows
    let startRow = 8; 
    let currentCategory = null;

    items.forEach((tx, index) => {
      const price = new Intl.NumberFormat("id-ID", {
        style: "currency",
        currency: "IDR",
        minimumFractionDigits: 0
      }).format(tx.price_per_qty);

      const row = worksheet.addRow([
        index + 1,
        tx.category_name,
        tx.item_name,
        price,
        tx.unit_of_measurement_name,
        tx.weight,
        tx.amount,
      ]);

      const rowNumber = row.number;

      if (currentCategory === null) {
        currentCategory = tx.category_name;
        startRow = rowNumber;
      } else if (currentCategory !== tx.category_name) {
        worksheet.mergeCells(`B${startRow}:B${rowNumber - 1}`);
        worksheet.getCell(`B${startRow}`).alignment = { vertical: "middle", horizontal: "center" };

        currentCategory = tx.category_name;
        startRow = rowNumber;
      }

      row.getCell(1).alignment = { vertical: "middle", horizontal: "center" };
      row.getCell(2).alignment = { vertical: "middle", horizontal: "center" };
      row.getCell(4).alignment = { horizontal: "left" };
      row.getCell(5).alignment = { vertical: "middle", horizontal: "center" };
      row.getCell(6).alignment = { horizontal: "left" };
      row.getCell(7).alignment = { horizontal: "left" };
    });

    const lastRow = worksheet.lastRow.number;
    worksheet.mergeCells(`B${startRow}:B${lastRow}`);
    worksheet.getCell(`B${startRow}`).alignment = { vertical: "middle", horizontal: "center" };

    const buffer = await workbook.xlsx.writeBuffer();  
    // end of create excel

    return [buffer, dateFormatted]
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
