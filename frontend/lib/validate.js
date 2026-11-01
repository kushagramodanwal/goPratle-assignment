// Code for validating the form in the browser.
// Each function returns errors in an object, for example: { eventName: "Enter at least 3 characters" }
// An empty object means everything is valid.
import { CATEGORY_CONFIG } from "./config";

// Today's date in "YYYY-MM-DD" format.
export function todayStr() {
  const d = new Date();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${d.getFullYear()}-${month}-${day}`;
}

// ---------- Step 1: event basics ----------
export function validateBasics(basics) {
  const errors = {};

  if (basics.eventName.trim().length < 3)
    errors.eventName = "Enter at least 3 characters";
  if (basics.eventName.trim().length > 120)
    errors.eventName = "Keep it under 120 characters";
  if (!basics.eventType) errors.eventType = "Choose an event type";
  if (basics.location.trim().length < 2)
    errors.location = "Enter a city or area";
  if (!basics.category) errors.category = "Choose who you need";

  if (!basics.dateStart) {
    errors.dateStart = "Pick a date";
  } else if (basics.dateStart < todayStr()) {
    errors.dateStart = "Date can't be in the past";
  }

  if (basics.dateMode === "range") {
    if (!basics.dateEnd) errors.dateEnd = "Pick an end date";
    else if (basics.dateEnd < basics.dateStart)
      errors.dateEnd = "End date must be on or after the start date";
  }

  return errors;
}

// ---------- Step 2 / 3: category-specific fields ----------

// Everything in the form is initially treated as text. Convert it to the correct type here.
// (Convert numbers to numbers, remove empty optional fields, and convert checkboxes to true/false).
export function cleanStep(fields, values) {
  const clean = {};
  for (const field of fields) {
    let value = values[field.key];

    if (field.type === "boolean") {
      clean[field.key] = value === true;
    } else if (field.type === "multi") {
      clean[field.key] = Array.isArray(value) ? value : [];
    } else if (field.type === "number") {
      clean[field.key] =
        value === undefined || value === "" ? undefined : Number(value);
    } else {
      const text = typeof value === "string" ? value.trim() : value;
      clean[field.key] = text === "" ? undefined : text;
    }
  }
  return clean;
}

// stepIndex: 0 = first details step, 1 = second details step
export function validateStep(category, stepIndex, values) {
  const fields = CATEGORY_CONFIG[category].steps[stepIndex].fields;
  const clean = cleanStep(fields, values);
  const errors = {};

  for (const field of fields) {
    const value = clean[field.key];

    if (field.type === "boolean") continue; // Checkboxes are always valid.

    // Check whether the field is empty.
    const isEmpty =
      value === undefined || (Array.isArray(value) && value.length === 0);
    if (isEmpty) {
      if (!field.optional) {
        errors[field.key] =
          field.type === "multi"
            ? "Pick at least one"
            : "This field is required";
      }
      continue;
    }

    if (field.type === "number") {
      if (Number.isNaN(value)) errors[field.key] = "Enter a number";
      else if (value < field.min)
        errors[field.key] = `Must be at least ${field.min}`;
      else if (value > field.max)
        errors[field.key] = `Must be at most ${field.max}`;
    }
    if (field.type === "text" || field.type === "textarea") {
      if (field.min && value.length < field.min)
        errors[field.key] = `Enter at least ${field.min} characters`;
      if (field.max && value.length > field.max)
        errors[field.key] = `Keep it under ${field.max} characters`;
    }
  }

  // Additional validation rules.
  if (
    category === "planner" &&
    stepIndex === 0 &&
    !errors.budgetMax &&
    !errors.budgetMin
  ) {
    if (clean.budgetMax < clean.budgetMin)
      errors.budgetMax = "Must be at least the starting budget";
  }
  if (category === "crew" && stepIndex === 0 && !errors.shiftEnd) {
    if (clean.shiftStart === clean.shiftEnd)
      errors.shiftEnd = "Must differ from the start time";
  }

  return { errors, clean };
}
