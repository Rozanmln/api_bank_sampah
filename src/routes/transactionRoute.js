const express = require("express");
const TransactionController = require("../controllers/transactionController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const transactionController = new TransactionController();

router.get("/transaction/get", verifyToken, transactionController.getAllTransaction);
router.post("/transaction/get/detail/:id", verifyToken, transactionController.getTransactionDetail);
router.post("/transaction/export-excel/:id", verifyToken, transactionController.transactionExportExcel);
router.post("/transaction/get/by-user", verifyToken, transactionController.getTransactionByUser);
router.post("/transaction/create", verifyToken, transactionController.createTransaction);
router.put("/transaction/update", verifyToken, transactionController.editTransaction);
router.delete("/transaction/delete/:id", verifyToken, transactionController.deleteTransaction);

module.exports = router;
