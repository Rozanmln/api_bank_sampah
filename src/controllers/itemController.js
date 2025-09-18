const ItemService = require("../service/itemService");
const Joi = require("joi");

const createItemSchema = Joi.object({
  item_name: Joi.string().required(),
  price: Joi.number().integer().required(),
  category_id: Joi.number().integer().required(),
  unit_of_measurement_id: Joi.number().integer().required(),
});

const updateItemSchema = Joi.object({
  item_id: Joi.number().integer().required(),
  item_name: Joi.string(),
  price: Joi.number().integer(),
  category_id: Joi.number().integer(),
  unit_of_measurement_id: Joi.number().integer(),
});

const getItemByCategorySchema = Joi.object({
  category_id: Joi.number().integer().required(),
});

class ItemController {
  constructor() {
    this.itemService = new ItemService();
  }

  getAllItem = async (req, res) => {
    try {
      const result = await this.itemService.getItem();

      res.status(200).json({ msg: "Get all item success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getItemByCategory = async (req, res) => {
    try {
      const { error, value } = getItemByCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const result = await this.itemService.getItemByCategory(value);

      res.status(200).json({ msg: "Get item by category success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  createItem = async (req, res) => {
    try {
      const { error, value } = createItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const create_item = await this.itemService.createItem(value);

      res.status(200).json({ msg: "Create Item Success", create_item });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  editItem = async (req, res) => {
    try {
      const { error, value } = updateItemSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const update_item = await this.itemService.updateItem(value);

      res.status(200).json({ msg: "Update Item Success", update_item });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteItem = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.itemService.deleteItem(id);

      res.status(200).json({ msg: "Delete Item Success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  // downloadPDF = async (req, res) => {
  //   try {
  //     const { id, obsId } = req.params;

  //     const result = await this.itemService.downloadPDF(id, obsId);

  //     res.setHeader("Content-Type", "application/pdf");
  //     res.send(result);
  //   } catch (error) {
  //     res.status(500).json({ msg: error.message });
  //   }
  // };
}

module.exports = ItemController;
