const TransactionService = require("../service/transactionService");
const Joi = require("joi");

const createTransactionSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  garbage_bank_id: Joi.number().integer().required(),
  phone_number: Joi.string().required(),
  customer: Joi.string().required(),
  number_of_customer_weighing: Joi.number().integer().required(),
  date_of_weighing: Joi.date().required(),
  items: Joi.array()
    .items(
      Joi.object({
        item_id: Joi.number().integer().required(),
        weight: Joi.number().precision(3).required(),
        price_per_qty: Joi.number().precision(3).required(),
        amount: Joi.number().precision(3).required(),
      })
    )
    .min(1)
    .required(),
});

const updateTransactionSchema = Joi.object({
  transaction_id: Joi.number().integer().required(),
  user_id: Joi.number().integer(),
  garbage_bank_id: Joi.number().integer(),
  phone_number: Joi.string(),
  customer: Joi.string(),
  number_of_customer_weighing: Joi.number().integer(),
  date_of_weighing: Joi.date(),
  items: Joi.array()
    .items(
      Joi.object({
        item_id: Joi.number().integer().required(),
        weight: Joi.number().precision(3).required(),
        price_per_qty: Joi.number().precision(3).required(),
        amount: Joi.number().precision(3).required(),
      })
    )
    .default([]),
});

const getTransactionByUserSchema = Joi.object({
  user_id: Joi.number().integer().required(),
});

class TransactionController {
  constructor() {
    this.transactionService = new TransactionService();
  }

  getAllTransaction = async (req, res) => {
    try {
      const result = await this.transactionService.getTransaction();

      res.status(200).json({ msg: "Get all transaction success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getTransactionDetail = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.transactionService.getTransactionDetail(id);

      res.status(200).json({ msg: "Get transaction detail success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  transactionExportExcel = async (req, res) => {
    try {
      const { id } = req.params;

      const [result, dateFormatted] = await this.transactionService.transactionExportExcel(id);

      const dateFile = dateFormatted.trim().replace(/ /g, "_");

      res.setHeader(
        "Content-Type",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
      );
      res.setHeader(
        "Content-Disposition",
        `attachment; filename=Transaksi_${dateFile}.xlsx`
      );

      res.end(result);

    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getTransactionByUser = async (req, res) => {
    try {
      const { error, value } = getTransactionByUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const result = await this.transactionService.getTransactionByUser(value);

      res.status(200).json({ msg: "Get transaction by user success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  createTransaction = async (req, res) => {
    try {
      const { error, value } = createTransactionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const create_transaction = await this.transactionService.createTransaction(value);

      res.status(200).json({ msg: "Create transaction Success", create_transaction });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  editTransaction = async (req, res) => {
    try {
      const { error, value } = updateTransactionSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const update_transaction = await this.transactionService.updateTransaction(value);

      res.status(200).json({ msg: "Update Transaction Success", update_transaction });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteTransaction = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.transactionService.deleteTransaction(id);

      res.status(200).json({ msg: "Delete Transaction Success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

}

module.exports = TransactionController;
