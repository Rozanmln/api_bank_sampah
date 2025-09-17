const UnitOfMeasurement = require("../model/unitOfMeasurement");

class UnitOfMeasurementService {

  async getUnitOfMeasurement() {
    let responseData = {};

    const unitOfMeasurement = await UnitOfMeasurement.findAll({
      attributes: ["unit_of_measurement_id", "unit_of_measurement_name"],
      raw: true,
    });

    responseData = unitOfMeasurement

    return responseData
  }
}

module.exports = UnitOfMeasurementService;
