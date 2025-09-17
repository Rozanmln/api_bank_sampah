const UnitOfMeasurementService = require("../service/unitOfMeasurementService");

class UnitOfMeasurementController {
  constructor() {
    this.unitOfMeasurement = new UnitOfMeasurementService();
  }

  getAllUnitOfMeasurement = async (req, res) => {
    try {
      const result = await this.unitOfMeasurement.getUnitOfMeasurement();

      res.status(200).json({ msg: "Get all unit of measurement success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

module.exports = UnitOfMeasurementController;
