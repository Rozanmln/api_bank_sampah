const { Op, where } = require("sequelize");
const Category = require("../model/category");
const { NotFound } = require("../utils/response");

class CategoryService {

  async getCategory() {
    let responseData = {};

    const category = await Category.findAll({
      attributes: ["category_id", "category_name"],
      where: {
        deleted_at: null,
      },
      raw: true,
    });

    responseData = category

    return responseData
  }

  async createCategory(value) {
    return await Category.create({
      category_name: value.category_name
    });
  }

  async updateCategory(value) {
    const foundCategory = await Category.findOne({
      where: {
        category_id: value.category_id,
      },
    });
    if (!foundCategory) {
      throw new NotFound("Category not found");
    }

    const [count, rows] = await Category.update(
      {
        category_name: value.category_name
      },
      {
        where: { category_id: value.category_id },
        returning: true,
      }
    );

    return rows[0]
  }

  async deleteCategory(id) {
    const foundCategory = await Category.findOne({
      where: {
        category_id: id,
      },
    });
    if (!foundCategory) {
      throw new NotFound("Category not found");
    }

    const now = new Date();

    const [count, rows] = await Category.update(
      {
        deleted_at: now
      },
      {
        where: { category_id: id },
        returning: true,
      }
    );

    return rows[0]
  }
}

module.exports = CategoryService;
