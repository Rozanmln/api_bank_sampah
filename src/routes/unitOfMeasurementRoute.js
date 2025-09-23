const express = require("express");
const UnitOfMeasurementController = require("../controllers/unitOfMeasurementController");
const { verifyToken } = require("../middleware/authMiddleware");

const router = express.Router();
const unitOfMeasurementController = new UnitOfMeasurementController();

router.get("/unit-of-measurement/get", verifyToken, unitOfMeasurementController.getAllUnitOfMeasurement);
router.post("/unit-of-measurement/create", verifyToken, unitOfMeasurementController.createUnitOfMeasurement);
router.put("/unit-of-measurement/update", verifyToken, unitOfMeasurementController.editUnitOfMeasurement);
router.delete("/unit-of-measurement/delete/:id", verifyToken, unitOfMeasurementController.deleteUnitOfMeasurement);

module.exports = router;
