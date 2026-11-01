const Requirement = require("../models/Requirement");
const { CATEGORIES } = require("../utils/constants");
const { validateRequirement } = require("../utils/validate");

// POST /api/requirements  -> Save a new requirement.
const createRequirement = async (req, res) => {
  try {
    const { errors, details } = validateRequirement(req.body);

    // If there are any errors, return a 400 response.
    if (Object.keys(errors).length > 0) {
      return res.status(400).json({ message: "Validation failed", errors });
    }

    const requirement = await Requirement.create({
      category: req.body.category,
      eventName: req.body.eventName,
      eventType: req.body.eventType,
      dateStart: req.body.dateStart,
      dateEnd: req.body.dateEnd || undefined,
      location: req.body.location,
      venue: req.body.venue || undefined,
      details: details,
    });

    res.status(201).json(requirement);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/requirements?category=crew  -> Get all requirements (newest first).
const getRequirements = async (req, res) => {
  try {
    const filter = {};
    if (CATEGORIES.includes(req.query.category)) {
      filter.category = req.query.category;
    }

    const requirements = await Requirement.find(filter)
      .sort({ createdAt: -1 })
      .limit(100);
    res.json(requirements);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/requirements/:id  -> Get a single requirement.
const getRequirementById = async (req, res) => {
  try {
    const requirement = await Requirement.findById(req.params.id);
    if (!requirement) {
      return res.status(404).json({ message: "Requirement not found" });
    }
    res.json(requirement);
  } catch (error) {
    // This block handles cases where the ID format is invalid.
    res.status(400).json({ message: "Invalid id" });
  }
};

module.exports = { createRequirement, getRequirements, getRequirementById };
