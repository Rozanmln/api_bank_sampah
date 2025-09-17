const express = require("express");
const CategoryController = require("../controllers/categoryController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const categoryController = new CategoryController();

router.get("/category/get", verifyToken, categoryController.getAllCategory);
router.post("/category/create", verifyToken, categoryController.createCategory);
router.put("/category/update", verifyToken, categoryController.editCategory);
router.delete("/category/delete/:id", verifyToken, categoryController.deleteCategory);

module.exports = router;
