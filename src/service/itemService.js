const { Op, where, Sequelize } = require("sequelize");
const User = require("../model/user");
const Item = require("../model/item");
const Category = require("../model/category");
const UnitOfMeasurement = require("../model/unitOfMeasurement");
const { NotFound } = require("../utils/response");
const downloadPDFReport = require("../utils/generateReport/index");

class ItemService {

  async getItem() {
    let responseData = {};

    const item = await Item.findAll({
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

    responseData = item

    return responseData
  }

  async getItemByCategory(value) {
    let responseData = {};

    const item = await Item.findAll({
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
        category_id: value.category_id,
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

    responseData = item

    return responseData
  }

  async createItem(value) {
    return await Item.create({
      item_name: value.item_name,
      price: value.price,
      category_id: value.category_id,
      unit_of_measurement_id: value.unit_of_measurement_id,
    });
  }

  async updateItem(value) {
    const foundItem = await Item.findOne({
      where: {
        item_id: value.item_id,
      },
    });
    if (!foundItem) {
      throw new NotFound("Item not found");
    }

    const [count, rows] = await Item.update(
      {
        item_name: value.item_name,
        price: value.price,
        category_id: value.category_id,
        unit_of_measurement_id: value.unit_of_measurement_id,
      },
      {
        where: { item_id: value.item_id },
        returning: true,
      }
    );

    return rows[0]
  }

  async deleteItem(id) {
    const foundItem = await Item.findOne({
      where: {
        item_id: id,
      },
    });
    if (!foundItem) {
      throw new NotFound("Item not found");
    }

    const now = new Date();

    const [count, rows] = await Item.update(
      {
        deleted_at: now
      },
      {
        where: { item_id: id },
        returning: true,
      }
    );

    return rows[0]
  }

  // async downloadPDF(id, obsId) {
  //   const dataPDF = await this.getSingleResultData(id, obsId);

  //   return await downloadPDFReport(dataPDF);
  // }
}

module.exports = ItemService;
