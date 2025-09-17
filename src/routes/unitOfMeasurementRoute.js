const express = require("express");
const UnitOfMeasurementController = require("../controllers/unitOfMeasurementController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const unitOfMeasurementController = new UnitOfMeasurementController();

router.get("/unit-of-measurement/get", verifyToken, unitOfMeasurementController.getAllUnitOfMeasurement);

module.exports = router;
