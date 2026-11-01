const express = require("express");
const {
  createRequirement,
  getRequirements,
  getRequirementById,
} = require("../controllers/requirementController");

const router = express.Router();

router.post("/", createRequirement);
router.get("/", getRequirements);
router.get("/:id", getRequirementById);

module.exports = router;
