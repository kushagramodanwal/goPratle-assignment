const C = require("./constants");

// Simple server-side data validation (no extra libraries)

// Validation rules for the details of each category.
// type: text | number | select | multi | boolean | time

const detailRules = {
  planner: [
    { key: "services", type: "multi", options: C.PLANNER_SERVICES },
    { key: "guestCount", type: "number", min: 1, max: 100000 },
    { key: "budgetMin", type: "number", min: 1, max: 100000000 },
    { key: "budgetMax", type: "number", min: 1, max: 100000000 },
    { key: "experienceLevel", type: "select", options: C.EXPERIENCE_LEVELS },
    { key: "timeline", type: "select", options: C.PLANNER_TIMELINES },
    { key: "notes", type: "text", max: 1000, optional: true },
  ],
  performer: [
    { key: "performerType", type: "select", options: C.PERFORMER_TYPES },
    { key: "genre", type: "text", min: 2, max: 60 },
    { key: "durationMinutes", type: "number", min: 15, max: 600 },
    { key: "language", type: "text", min: 2, max: 60 },
    { key: "budget", type: "number", min: 1, max: 100000000 },
    { key: "equipmentProvided", type: "boolean" },
    { key: "dressCode", type: "text", max: 120, optional: true },
    { key: "techRider", type: "text", max: 1000, optional: true },
  ],
  crew: [
    { key: "roles", type: "multi", options: C.CREW_ROLES },
    { key: "headcount", type: "number", min: 1, max: 1000 },
    { key: "shiftStart", type: "time" },
    { key: "shiftEnd", type: "time" },
    { key: "payPerDay", type: "number", min: 1, max: 100000000 },
    { key: "experienceLevel", type: "select", options: C.EXPERIENCE_LEVELS },
    { key: "accommodation", type: "boolean" },
    { key: "transport", type: "boolean" },
  ],
};

// Validate an individual field.
// Return an error message if invalid; otherwise, return null.
function checkField(rule, value) {
  const isEmpty = value === undefined || value === null || value === "";

  if (rule.type === "boolean") {
    return typeof value === "boolean" ? null : "Must be true or false";
  }

  if (isEmpty) {
    return rule.optional ? null : "This field is required";
  }

  if (rule.type === "text") {
    if (typeof value !== "string") return "Must be text";
    if (rule.min && value.trim().length < rule.min)
      return `Must be at least ${rule.min} characters`;
    if (rule.max && value.trim().length > rule.max)
      return `Must be at most ${rule.max} characters`;
  }

  if (rule.type === "number") {
    if (typeof value !== "number" || Number.isNaN(value))
      return "Must be a number";
    if (value < rule.min) return `Must be at least ${rule.min}`;
    if (value > rule.max) return `Must be at most ${rule.max}`;
  }

  if (rule.type === "select") {
    if (!rule.options.includes(value)) return "Invalid choice";
  }

  if (rule.type === "multi") {
    if (!Array.isArray(value) || value.length === 0) return "Pick at least one";
    if (!value.every((v) => rule.options.includes(v))) return "Invalid choice";
  }

  if (rule.type === "time") {
    if (!/^([01]\d|2[0-3]):[0-5]\d$/.test(value)) return "Use HH:MM";
  }

  return null;
}

function isValidDate(text) {
  return (
    typeof text === "string" &&
    /^\d{4}-\d{2}-\d{2}$/.test(text) &&
    !Number.isNaN(Date.parse(text))
  );
}

// Validate the entire requirement.
// Returns: { errors: {...}, details: {...} }
// If errors is empty, all fields are valid.
function validateRequirement(body) {
  const errors = {};
  const details = {};

  // 1. Validate category
  if (!C.CATEGORIES.includes(body.category)) {
    errors.category = "Choose planner, performer or crew";
    return { errors, details };
  }

  // 2. Validate basic fields
  const basicRules = [
    { key: "eventName", type: "text", min: 3, max: 120 },
    { key: "eventType", type: "select", options: C.EVENT_TYPES },
    { key: "location", type: "text", min: 2, max: 120 },
    { key: "venue", type: "text", max: 120, optional: true },
  ];

  for (const rule of basicRules) {
    const message = checkField(rule, body[rule.key]);
    if (message) errors[rule.key] = message;
  }

  // 3. Validate dates
  if (!isValidDate(body.dateStart)) {
    errors.dateStart = "Use a valid date (YYYY-MM-DD)";
  } else {
    // Allow dates up to yesterday to handle timezone differences
    // so that today's date is accepted across different timezones.
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000)
      .toISOString()
      .slice(0, 10);

    if (body.dateStart < yesterday)
      errors.dateStart = "Date can't be in the past";
  }

  if (body.dateEnd) {
    if (!isValidDate(body.dateEnd))
      errors.dateEnd = "Use a valid date (YYYY-MM-DD)";
    else if (body.dateEnd < body.dateStart)
      errors.dateEnd = "End date must be on or after the start date";
  }

  // 4. Validate category-specific details.
  // Only process fields belonging to the selected category.
  const info = body.details || {};

  for (const rule of detailRules[body.category]) {
    const message = checkField(rule, info[rule.key]);

    if (message) {
      errors["details." + rule.key] = message;
    } else if (info[rule.key] !== undefined && info[rule.key] !== "") {
      details[rule.key] = info[rule.key];
    }
  }

  // 5. Apply additional business validation rules
  if (body.category === "planner" && info.budgetMax < info.budgetMin) {
    errors["details.budgetMax"] = "Max budget must be at least the minimum";
  }

  if (body.category === "crew" && info.shiftStart === info.shiftEnd) {
    errors["details.shiftEnd"] = "Shift end must differ from shift start";
  }

  return { errors, details };
}

module.exports = { validateRequirement };
