const GarbageBankService = require("../service/garbageBankService");
const Joi = require("joi");

const createGarbageBankSchema = Joi.object({
  garbage_bank_name: Joi.string().required(),
  rw_name: Joi.string().required(),
  address: Joi.string().required(),
});

const updateGarbageBankSchema = Joi.object({
  garbage_bank_id: Joi.number().integer().required(),
  garbage_bank_name: Joi.string(),
  rw_name: Joi.string(),
  address: Joi.string(),
});

class GarbageBankController {
  constructor() {
    this.garbageBankService = new GarbageBankService();
  }

  getAllGarbageBank = async (req, res) => {
    try {
      const result = await this.garbageBankService.getGarbageBank();

      res.status(200).json({ msg: "Get all Garbage Bank success", result });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  createGarbageBank = async (req, res) => {
    try {
      const { error, value } = createGarbageBankSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const create_garbage_bank = await this.garbageBankService.createGarbageBank(value);

      res.status(200).json({ msg: "Create Garbage Bank Success", create_garbage_bank });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  editGarbageBank = async (req, res) => {
    try {
      const { error, value } = updateGarbageBankSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      const update_garbage_bank = await this.garbageBankService.updateGarbageBank(value);

      res.status(200).json({ msg: "Update Garbage Bank Success", update_garbage_bank });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };
}

module.exports = GarbageBankController;
