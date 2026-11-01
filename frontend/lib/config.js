// All form fields are defined here.
// Step 2 and Step 3 are generated from this list, so adding a new field = just add one line here.
//
// type: text | number | select | multi | boolean | textarea | time

export const CATEGORIES = ["planner", "performer", "crew"];

export const EVENT_TYPES = [
  "wedding",
  "corporate",
  "concert",
  "birthday",
  "festival",
  "conference",
  "other",
];

// "live-band" -> "Live band"
export function pretty(text) {
  const withSpaces = text.replace(/-/g, " ");
  return withSpaces.charAt(0).toUpperCase() + withSpaces.slice(1);
}

const EXPERIENCE_OPTIONS = [
  { value: "any", label: "Any level" },
  { value: "experienced", label: "Experienced (2+ years)" },
  { value: "expert", label: "Expert (5+ years)" },
];

export const CATEGORY_CONFIG = {
  planner: {
    label: "Event planner",
    blurb: "Someone to plan and run the whole event, or key parts of it.",
    steps: [
      {
        title: "What you need planned",
        description: "Tell planners the scope and the budget you have in mind.",
        fields: [
          {
            key: "services",
            label: "Services needed",
            type: "multi",
            wide: true,
            options: [
              { value: "decor", label: "Decor" },
              { value: "catering", label: "Catering" },
              { value: "logistics", label: "Logistics" },
              { value: "photography", label: "Photography" },
              { value: "entertainment", label: "Entertainment" },
              { value: "venue-sourcing", label: "Venue sourcing" },
            ],
          },
          {
            key: "guestCount",
            label: "Expected guests",
            type: "number",
            min: 1,
            max: 100000,
            placeholder: "300",
          },
          {
            key: "budgetMin",
            label: "Budget from",
            type: "number",
            min: 1,
            max: 100000000,
            prefix: "₹",
            placeholder: "500000",
          },
          {
            key: "budgetMax",
            label: "Budget up to",
            type: "number",
            min: 1,
            max: 100000000,
            prefix: "₹",
            placeholder: "900000",
          },
        ],
      },
      {
        title: "Planner preferences",
        description: "How experienced they should be and when you need them.",
        fields: [
          {
            key: "experienceLevel",
            label: "Experience level",
            type: "select",
            options: EXPERIENCE_OPTIONS,
          },
          {
            key: "timeline",
            label: "When do you need to finalise?",
            type: "select",
            options: [
              { value: "urgent", label: "Urgent (under 2 weeks)" },
              { value: "standard", label: "Standard (2 to 6 weeks)" },
              { value: "flexible", label: "Flexible" },
            ],
          },
          {
            key: "notes",
            label: "Special requests",
            type: "textarea",
            max: 1000,
            optional: true,
            wide: true,
            placeholder: "Theme, rituals, vendors you already have…",
          },
        ],
      },
    ],
  },

  performer: {
    label: "Performer",
    blurb: "A DJ, band, anchor or act to entertain your guests.",
    steps: [
      {
        title: "The act you want",
        description: "What kind of performance, and for how long.",
        fields: [
          {
            key: "performerType",
            label: "Performer type",
            type: "select",
            options: [
              { value: "dj", label: "DJ" },
              { value: "live-band", label: "Live band" },
              { value: "anchor", label: "Anchor / MC" },
              { value: "singer", label: "Singer" },
              { value: "dancer", label: "Dancer" },
              { value: "comedian", label: "Comedian" },
              { value: "other", label: "Other" },
            ],
          },
          {
            key: "genre",
            label: "Genre or style",
            type: "text",
            min: 2,
            max: 60,
            placeholder: "Bollywood, sufi, EDM…",
          },
          {
            key: "durationMinutes",
            label: "Performance length",
            type: "number",
            min: 15,
            max: 600,
            suffix: "minutes",
            placeholder: "120",
          },
          {
            key: "language",
            label: "Language",
            type: "text",
            min: 2,
            max: 60,
            placeholder: "Hindi",
          },
        ],
      },
      {
        title: "Budget and logistics",
        description: "What you can pay and what the venue provides.",
        fields: [
          {
            key: "budget",
            label: "Budget",
            type: "number",
            min: 1,
            max: 100000000,
            prefix: "₹",
            placeholder: "50000",
          },
          {
            key: "equipmentProvided",
            label: "Venue provides sound equipment",
            type: "boolean",
          },
          {
            key: "dressCode",
            label: "Dress code",
            type: "text",
            max: 120,
            optional: true,
            placeholder: "Black tie, ethnic…",
          },
          {
            key: "techRider",
            label: "Tech or hospitality needs",
            type: "textarea",
            max: 1000,
            optional: true,
            wide: true,
            placeholder: "Mics, green room, travel…",
          },
        ],
      },
    ],
  },

  crew: {
    label: "Event crew",
    blurb: "Hands on the ground: sound, lighting, stage, security and more.",
    steps: [
      {
        title: "Roles and shifts",
        description: "Who you need on site and when they start and finish.",
        fields: [
          {
            key: "roles",
            label: "Roles needed",
            type: "multi",
            wide: true,
            options: [
              { value: "sound", label: "Sound" },
              { value: "lighting", label: "Lighting" },
              { value: "stage-hands", label: "Stage hands" },
              { value: "security", label: "Security" },
              { value: "ushers", label: "Ushers and hosts" },
              { value: "setup-teardown", label: "Setup and teardown" },
            ],
          },
          {
            key: "headcount",
            label: "People needed",
            type: "number",
            min: 1,
            max: 1000,
            placeholder: "6",
          },
          { key: "shiftStart", label: "Shift starts", type: "time" },
          { key: "shiftEnd", label: "Shift ends", type: "time" },
        ],
      },
      {
        title: "Pay and conditions",
        description: "What crew can expect for the day.",
        fields: [
          {
            key: "payPerDay",
            label: "Pay per person per day",
            type: "number",
            min: 1,
            max: 100000000,
            prefix: "₹",
            placeholder: "2500",
          },
          {
            key: "experienceLevel",
            label: "Experience level",
            type: "select",
            options: EXPERIENCE_OPTIONS,
          },
          {
            key: "accommodation",
            label: "Accommodation provided",
            type: "boolean",
          },
          { key: "transport", label: "Transport provided", type: "boolean" },
        ],
      },
    ],
  },
};

// Convert a field value into text suitable for display on the screen.
export function formatValue(field, value) {
  if (value === undefined || value === null || value === "")
    return "Not specified";

  if (field.type === "boolean") return value ? "Yes" : "No";

  if (field.type === "multi") {
    const labels = value.map((v) => {
      const option = field.options.find((o) => o.value === v);
      return option ? option.label : v;
    });
    return labels.join(", ");
  }

  if (field.type === "select") {
    const option = field.options.find((o) => o.value === value);
    return option ? option.label : value;
  }

  if (field.type === "number") {
    const text = Number(value).toLocaleString("en-IN");
    return (
      (field.prefix || "") + text + (field.suffix ? " " + field.suffix : "")
    );
  }

  return String(value);
}

export function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  });
}
