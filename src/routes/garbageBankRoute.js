const express = require("express");
const GarbageBankController = require("../controllers/garbageBankController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const garbageBankControllerController = new GarbageBankController();

router.get("/garbage-bank/get", verifyToken, garbageBankControllerController.getAllGarbageBank);
router.post("/garbage-bank/create", verifyToken, garbageBankControllerController.createGarbageBank);
router.put("/garbage-bank/update", verifyToken, garbageBankControllerController.editGarbageBank);

module.exports = router;
