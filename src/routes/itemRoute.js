const express = require("express");
const ItemController = require("../controllers/itemController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const itemController = new ItemController();

router.get("/item/get", verifyToken, itemController.getAllItem);
router.post("/item/get/by-category", verifyToken, itemController.getItemByCategory);
router.post("/item/create", verifyToken, itemController.createItem);
router.put("/item/update", verifyToken, itemController.editItem);
router.delete("/item/delete/:id", verifyToken, itemController.deleteItem);

module.exports = router;
