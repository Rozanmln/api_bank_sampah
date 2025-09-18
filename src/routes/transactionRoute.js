const express = require("express");
const TransactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const transactionController = new TransactionController();

router.get("/transaction/get", verifyToken, transactionController.getAllTransaction);
// router.post("/transaction/get/by-category", verifyToken, transactionController.getItemByCategory);
router.post("/transaction/create", verifyToken, transactionController.createTransaction);
// router.put("/transaction/update", verifyToken, transactionController.editItem);
// router.delete("/transaction/delete/:id", verifyToken, transactionController.deleteItem);

module.exports = router;
