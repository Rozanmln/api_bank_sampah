const express = require("express");
const { verifyToken } = require("../middleware/authMiddleware")
const UserController = require("../controllers/userController");

const router = express.Router();
const userController = new UserController();

router.post("/user/create", userController.createUser);
router.post("/user/login", userController.login);

router.get("/user/get", verifyToken, userController.getUser);
router.get("/user/privilege", verifyToken, userController.getUserPrivilege);
router.put("/user/update", verifyToken, userController.updateUser);

module.exports = router;