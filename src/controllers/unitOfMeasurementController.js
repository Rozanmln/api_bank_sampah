const UnitOfMeasurementService = require("../service/unitOfMeasurementService");
const Joi = require("joi");

const createUnitOfMeasurementSchema = Joi.object({
  unit_of_measurement_name: Joi.string().required()
});

const updateUnitOfMeasurementSchema = Joi.object({
  unit_of_measurement_id: Joi.number().integer().required(),
  unit_of_measurement_name: Joi.string()
});

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

  createUnitOfMeasurement = async (req, res) => {
    try {
      const { error, value } = createUnitOfMeasurementSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const create_unit_of_measurement = await this.unitOfMeasurement.createUnitOfMeasurement(value);

      res.status(200).json({ msg: "Create Unit of Measurement Success", create_unit_of_measurement });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  editUnitOfMeasurement = async (req, res) => {
    try {
      const { error, value } = updateUnitOfMeasurementSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const update_unit_of_measurement = await this.unitOfMeasurement.updateUnitOfMeasurement(value);

      res.status(200).json({ msg: "Update Unit of Measurement Success", update_unit_of_measurement });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  deleteUnitOfMeasurement = async (req, res) => {
    try {
      const { id } = req.params;

      const result = await this.unitOfMeasurement.deleteUnitOfMeasurement(id);

      res.status(200).json({ msg: "Delete Unit of Measurement Success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

module.exports = UnitOfMeasurementController;
