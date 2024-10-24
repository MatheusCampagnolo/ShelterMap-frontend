const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.get('/login', authController.getLoginPage);
router.post('/login', authController.login);

router.post('/logout', authController.logout);

router.get('/register', authController.getRegisterPage);
router.post('/register', authController.register);

module.exports = router;
