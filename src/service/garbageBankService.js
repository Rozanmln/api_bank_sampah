const { Op, where, Sequelize } = require("sequelize");
const GarbageBank = require("../model/garbageBank");
const { NotFound } = require("../utils/response");

class GarbageBankService {

  async getGarbageBank() {
    let responseData = {};

    const garbageBank = await GarbageBank.findAll({
      attributes: [
        "garbage_bank_id", 
        "garbage_bank_name", 
        "rw_name", 
        "address"
      ],
      where: {
        deleted_at: null,
      },
      raw: true,
    });

    responseData = garbageBank

    return responseData
  }

  async createGarbageBank(value) {
    return await GarbageBank.create({
      garbage_bank_name: value.garbage_bank_name,
      rw_name: value.rw_name,
      address: value.address,
    });
  }

  async updateGarbageBank(value) {
    const foundGarbageBank = await GarbageBank.findOne({
      where: {
        garbage_bank_id: value.garbage_bank_id,
      },
    });
    if (!foundGarbageBank) {
      throw new NotFound("Garbage Bank not found");
    }

    const [count, rows] = await GarbageBank.update(
      {
        garbage_bank_name: value.garbage_bank_name,
        rw_name: value.rw_name,
        address: value.address,
      },
      {
        where: { garbage_bank_id: value.garbage_bank_id },
        returning: true,
      }
    );

    return rows[0]
  }
}

module.exports = GarbageBankService;
