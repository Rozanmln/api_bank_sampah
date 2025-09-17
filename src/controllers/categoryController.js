const CategoryService = require("../service/categoryService");
const Joi = require("joi");

const createCategorySchema = Joi.object({
  category_name: Joi.string().required()
});

const updateCategorySchema = Joi.object({
  category_id: Joi.number().integer().required(),
  category_name: Joi.string()
});

class CategoryController {
  constructor() {
    this.categoryService = new CategoryService();
  }

  getAllCategory = async (req, res) => {
    try {
      const result = await this.categoryService.getCategory();

      res.status(200).json({ msg: "Get all category success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  createCategory = async (req, res) => {
    try {
      const { error, value } = createCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const create_category = await this.categoryService.createCategory(value);

      res.status(200).json({ msg: "Create Category Success", create_category });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  editCategory = async (req, res) => {
    try {
      const { error, value } = updateCategorySchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const update_category = await this.categoryService.updateCategory(value);

      res.status(200).json({ msg: "Update Category Success", update_category });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteCategory = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.categoryService.deleteCategory(id);

      res.status(200).json({ msg: "Delete Category Success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

module.exports = CategoryController;
