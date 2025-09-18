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
        total_price: Joi.number().precision(3).required(),
      })
    )
    .min(1)
    .required(),
});

const updateItemSchema = Joi.object({
  item_id: Joi.number().integer().required(),
  item_name: Joi.string(),
  price: Joi.number(),
  category_id: Joi.number().integer(),
  unit_of_measurement_id: Joi.number().integer(),
});

const getItemByCategorySchema = Joi.object({
  category_id: Joi.number().integer().required(),
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

//   getItemByCategory = async (req, res) => {
//     try {
//       const { error, value } = getItemByCategorySchema.validate(req.body);
//       if (error) {
//         return res.status(400).json({ msg: error.details[0].message });
//       }

//       const result = await this.transactionService.getItemByCategory(value);

//       res.status(200).json({ msg: "Get item by category success", result });
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   };

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

//   editItem = async (req, res) => {
//     try {
//       const { error, value } = updateItemSchema.validate(req.body);
//       if (error) {
//         return res.status(400).json({ msg: error.details[0].message });
//       }

//       const update_item = await this.transactionService.updateItem(value);

//       res.status(200).json({ msg: "Update Item Success", update_item });
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   };

//   deleteItem = async (req, res) => {
//     try {
//       const { id } = req.params;

//       const result = await this.transactionService.deleteItem(id);

//       res.status(200).json({ msg: "Delete Item Success", result });
//     } catch (error) {
//       res.status(500).json({ msg: error.message });
//     }
//   };

}

module.exports = TransactionController;
