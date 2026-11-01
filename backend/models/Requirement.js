const mongoose = require("mongoose");
const { CATEGORIES, EVENT_TYPES } = require("../utils/constants");

// A single collection named "requirements".
// category = planner / performer / crew
// details = additional fields for that category (each category has different fields)
const requirementSchema = new mongoose.Schema(
  {
    category: { type: String, required: true, enum: CATEGORIES },
    eventName: { type: String, required: true, trim: true },
    eventType: { type: String, required: true, enum: EVENT_TYPES },
    dateStart: { type: Date, required: true },
    dateEnd: { type: Date },
    location: { type: String, required: true, trim: true },
    venue: { type: String, trim: true },
    details: { type: Object, required: true },
  },
  { timestamps: true }, // createdAt and updatedAt will be added automatically.
);

module.exports = mongoose.model("Requirement", requirementSchema);
