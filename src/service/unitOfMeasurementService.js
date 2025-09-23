const UnitOfMeasurement = require("../model/unitOfMeasurement");

class UnitOfMeasurementService {

  async getUnitOfMeasurement() {
    let responseData = {};

    const unitOfMeasurement = await UnitOfMeasurement.findAll({
      attributes: ["unit_of_measurement_id", "unit_of_measurement_name"],
      where: {
        deleted_at: null,
      },
      raw: true,
    });

    responseData = unitOfMeasurement

    return responseData
  }

  async createUnitOfMeasurement(value) {
    return await UnitOfMeasurement.create({
      unit_of_measurement_name: value.unit_of_measurement_name
    });
  }

  async updateUnitOfMeasurement(value) {
    const foundUnitOfMeasurement = await UnitOfMeasurement.findOne({
      where: {
        unit_of_measurement_id: value.unit_of_measurement_id,
      },
    });
    if (!foundUnitOfMeasurement) {
      throw new NotFound("Unit of Measurement not found");
    }

    const [count, rows] = await UnitOfMeasurement.update(
      {
        unit_of_measurement_name: value.unit_of_measurement_name
      },
      {
        where: { unit_of_measurement_id: value.unit_of_measurement_id },
        returning: true,
      }
    );

    return rows[0]
  }

  async deleteUnitOfMeasurement(id) {
    const foundUnitOfMeasurement = await UnitOfMeasurement.findOne({
      where: {
        unit_of_measurement_id: id,
      },
    });
    if (!foundUnitOfMeasurement) {
      throw new NotFound("Unit of Measurement not found");
    }

    const now = new Date();

    const [count, rows] = await UnitOfMeasurement.update(
      {
        deleted_at: now
      },
      {
        where: { unit_of_measurement_id: id },
        returning: true,
      }
    );

    return rows[0]
  }
}

module.exports = UnitOfMeasurementService;
