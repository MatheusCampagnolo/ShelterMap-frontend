const express = require("express");
const router = express.Router();
const shelterController = require("../controllers/shelterController");
const { authenticateToken } = require("../middlewares/authMiddleware");

router.get("/", shelterController.getAllShelters);

router.get('/new', authenticateToken, shelterController.getNewShelterPage);
router.post("/new", authenticateToken, shelterController.createShelter);

router.get("/:id", shelterController.getShelterDetails);

router.get("/:id/edit", authenticateToken, shelterController.editShelterPage);
router.post('/:id/edit', authenticateToken, shelterController.editShelter);

router.delete("/:id", authenticateToken, shelterController.deleteShelter);

// upvotes

router.post("/:id/upvote", authenticateToken, shelterController.upvoteShelter);

module.exports = router;
