const User = require("../model/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const UserRole = require("../model/userRole");
const Role = require("../model/role");
const RolePrivilege = require("../model/rolePrivilege");
const GarbageBank = require("../model/garbageBank");
const Privilege = require("../model/privilege");
const { Op, where, Sequelize } = require("sequelize");
const Joi = require("joi");

require("dotenv").config();
const secretKey = process.env.SECRETKEY;

const createUserSchema = Joi.object({
  user_name: Joi.string().required(),
  password: Joi.string().required(),
  email: Joi.string().required(),
  address: Joi.string().required(),
  phone_number: Joi.string().required(),
  garbage_bank_id: Joi.number().integer(),
  role_ids: Joi.array().required(),
});

const updateUserSchema = Joi.object({
  user_id: Joi.number().integer().required(),
  user_name: Joi.string(),
  password: Joi.string(),
  email: Joi.string(),
  address: Joi.string(),
  phone_number: Joi.string(),
  garbage_bank_id: Joi.number().integer(),
  role_ids: Joi.array().default([]),
});

class UserController {
  isValidEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  }

  createUser = async (req, res) => {
    try {
      const { error, value } = createUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      if (!this.isValidEmail(value.email)) {
        res.status(400).json({ msg: `Format email salah` });
      } else {
        const salt = bcrypt.genSaltSync(10);
        const hashedPassword = await bcrypt.hashSync(value.password, salt);

        const data = await User.create({
          username: value.user_name,
          password: hashedPassword,
          email: value.email,
          address: value.address,
          phone_number: value.phone_number,
          garbage_bank_id: value.garbage_bank_id,
        });

        if (value.role_ids.length > 0) {
          for (let i = 0; i < value.role_ids.length; i++) {
            await UserRole.create({
              role_id: value.role_ids[i],
              user_id: data.user_id,
            });
          }
        }

        res.status(201).json({ msg: "Register User Success", data });
      }
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  login = async (req, res) => {
    try {
      const { username, password } = req.body;
      let responseBody = {}

      const foundUser = await User.findOne({
        attributes: [
          "user_id", 
          "username", 
          "password", 
          "email", 
          "address", 
          "phone_number",
          "garbage_bank_id",
          [Sequelize.col("garbage_bank.garbage_bank_name"), "garbage_bank_name"],
        ],
        where: {
          username: username,
        },
        include: [
          {
            model: GarbageBank,
            as: "garbage_bank",
            attributes: [],
          },
        ],
        raw: true
      });
      if (!foundUser) return res.status(400).json({ msg: "Wrong password or username" });

      responseBody = {
        ...responseBody,
        ...foundUser
      }

      const match = bcrypt.compareSync(password, foundUser.password);
      if (!match) return res.status(400).json({ msg: "Wrong password or username" });

      const token = jwt.sign({ username, id: foundUser.user_id, username: foundUser.username }, secretKey, {
        expiresIn: "1d",
      });

      delete responseBody.password;
      
      responseBody = {
        ...responseBody,
        token: token
      }

      res.status(200).json({ msg: "Login Success", responseBody });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getUser = async (req, res) => {
    try {
      let responseData = {};
      let role_data = [];
      
      const user_data = await User.findOne({
        attributes: [
          "user_id", 
          "username", 
          "email", 
          "address", 
          "phone_number",
          "garbage_bank_id",
          [Sequelize.col("garbage_bank.garbage_bank_name"), "garbage_bank_name"],
        ],
        where: {
          user_id: req.user.id,
        },
        include: [
          {
            model: GarbageBank,
            as: "garbage_bank",
            attributes: [],
          },
        ],
      });

      if (!user_data) {
        return res.status(500).json({ msg: "User not found" });
      }

      responseData = user_data.dataValues;

      const user_role_data = await UserRole.findAll({
        attributes: ["user_role_id", "user_id", "role_id"],
        where: {
          user_id: user_data.user_id,
        },
      });

      for (let i = 0; i < user_role_data.length; i++) {
        const role = await Role.findOne({
          attributes: ["role_id", "role_name"],
          where: {
            role_id: user_role_data[i].role_id,
          },
        });

        if (role) {
          role_data.push(role.dataValues)
        }
      }

      responseData = {
        ...responseData,
        roles: role_data,
      };

      res.status(200).json({ msg: "Get User Success", responseData });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  updateUser = async (req, res) => {
    try {
      const { error, value } = updateUserSchema.validate(req.body);
      if (error) {
        return res.status(400).json({ msg: error.details[0].message });
      }

      let responseData = {};

      const foundUser = await User.findOne({
        where: {
          user_id: value.user_id,
        },
      });

      if (!foundUser) return res.status(500).json({ msg: "User not found" });

      const [affectedCount, updatedUsers] = await User.update(
        {
          username: value.user_name,
          email: value.email,
          address: value.address,
          phone_number: value.phone_number,
          garbage_bank_id: value.garbage_bank_id,
        },
        {
          where: { user_id: value.user_id },
          returning: true,
        }
      );

      if (value.role_ids.length > 0) {
        await UserRole.destroy(
          {
            where: { user_id: value.user_id }
          }
        )

        for (let i = 0; i < value.role_ids.length; i++) {
          await UserRole.create({
            role_id: value.role_ids[i],
            user_id: value.user_id,
          });
        }
      }

      responseData = updatedUsers[0]

      res.status(200).json({ msg: "Update User Success", responseData });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  getUserPrivilege = async (req, res) => {
    try {
      let responseData = {};

      const user_data = await User.findOne({
        attributes: ["user_id", "username", "email", "address", "phone_number"],
        where: {
          user_id: req.user.id,
        },
      });

      if (!user_data) {
        return res.status(500).json({ msg: "User not found" });
      }
      
      const user_role_data = await UserRole.findAll({
        attributes: ["role_id"],
        where: {
          user_id: req.user.id,
        },
      });

      const role_ids = user_role_data.map((item) => item.dataValues.role_id)

      const role_privilege = await RolePrivilege.findAll({
        attributes: ["privilege_id"],
        where: {
          role_id: {
            [Op.in]: role_ids,
          },
        },
      });

      const privilege_ids = role_privilege.map((item) => item.dataValues.privilege_id)

      const unique_privilege_ids = [...new Set(privilege_ids)];

      const privilege = await Privilege.findAll({
        attributes: ["privilege_id", "privilege_name", "description"],
        where: {
          privilege_id: {
            [Op.in]: unique_privilege_ids,
          },
        },
        raw: true,
      });
      
      const privilages_name_only = privilege.map((item) => item.privilege_name)

      responseData = privilages_name_only
      
      res.status(200).json({ msg: "Get User Privilege Success", responseData });
    } catch (error) {
      res.status(500).json({ msg: error.message });
    }
  };

  // crud role, role_privilege, sama privilege nanti aja kali ya masih predefined gt masi dikit soalny
}

module.exports = UserController;
