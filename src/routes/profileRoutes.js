const express = require("express");
const router = express.Router();
const profileController = require("../controllers/profileController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/profile", authenticateToken, profileController.showProfile);

module.exports = router;
