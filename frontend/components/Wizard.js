"use client";
import { useState } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  EVENT_TYPES,
  formatDate,
  formatValue,
  pretty,
} from "@/lib/config";
import { todayStr, validateBasics, validateStep } from "@/lib/validate";
import { createRequirement } from "@/lib/api";
import Fields from "./Fields";

const EMPTY_BASICS = {
  eventName: "",
  eventType: "",
  dateMode: "single", // "single" or "range"
  dateStart: "",
  dateEnd: "",
  location: "",
  venue: "",
  category: "",
};

export default function Wizard() {
  const [step, setStep] = useState(0); // 0,1,2,3 = four steps
  const [basics, setBasics] = useState(EMPTY_BASICS); // step 1 data
  const [details, setDetails] = useState({}); // step 2 and 3 data
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(""); // server error message
  const [sending, setSending] = useState(false);
  const [result, setResult] = useState(null); // backend response after saving

  const category = basics.category;
  const config = category ? CATEGORY_CONFIG[category] : null;

  const stepTitles = [
    "Event basics",
    config ? config.steps[0].title : "Requirements",
    config ? config.steps[1].title : "Details",
    "Review and post",
  ];

  // ---------- Small helper functions ----------

  // Update a field in basics and clear its previous error.
  function changeBasics(key, value) {
    setBasics({ ...basics, [key]: value });
    setErrors({ ...errors, [key]: undefined });
  }

  // Clear previous answers when the category changes.
  function chooseCategory(newCategory) {
    if (newCategory !== basics.category) setDetails({});
    changeBasics("category", newCategory);
  }

  // Update a field in details.
  function changeDetails(key, value) {
    setDetails({ ...details, [key]: value });
    setErrors({ ...errors, [key]: undefined });
  }

  // ---------- Continue / Back ----------

  function goNext() {
    setBanner("");

    if (step === 0) {
      const found = validateBasics(basics);
      if (Object.keys(found).length > 0) return setErrors(found);
    }
    if (step === 1 || step === 2) {
      const { errors: found } = validateStep(category, step - 1, details);
      if (Object.keys(found).length > 0) return setErrors(found);
    }

    setErrors({});
    setStep(step + 1);
    window.scrollTo({ top: 0 });
  }

  function goBack() {
    setErrors({});
    setBanner("");
    setStep(step - 1);
  }

  // ---------- Post button ----------

  async function submit() {
    if (sending) return; // Prevent double-clicking.

    // Validate everything again before submitting.
    const basicErrors = validateBasics(basics);
    if (Object.keys(basicErrors).length > 0) {
      setStep(0);
      return setErrors(basicErrors);
    }

    let allDetails = {};
    for (let i = 0; i < 2; i++) {
      const { errors: found, clean } = validateStep(category, i, details);
      if (Object.keys(found).length > 0) {
        setStep(i + 1);
        return setErrors(found);
      }
      allDetails = { ...allDetails, ...clean };
    }

    const data = {
      category: category,
      eventName: basics.eventName.trim(),
      eventType: basics.eventType,
      dateStart: basics.dateStart,
      dateEnd: basics.dateMode === "range" ? basics.dateEnd : undefined,
      location: basics.location.trim(),
      venue: basics.venue.trim() || undefined,
      details: allDetails,
    };

    setSending(true);
    setBanner("");
    try {
      const saved = await createRequirement(data);
      setResult(saved);
    } catch (error) {
      if (error.fieldErrors) {
        // Display the validation errors returned by the server.
        const lines = Object.entries(error.fieldErrors).map(
          ([key, msg]) => `${key}: ${msg}`,
        );
        setBanner(`${error.message}. ${lines.join(" · ")}`);
      } else {
        setBanner(
          "Couldn't reach the server. Please try again in a few seconds.",
        );
      }
    }
    setSending(false);
  }

  function postAnother() {
    setResult(null);
    setBasics(EMPTY_BASICS);
    setDetails({});
    setErrors({});
    setStep(0);
  }

  // ---------- Screen ----------

  return (
    <div className="shell">
      {/* Left side: progress */}
      <aside className="rail">
        <p className="brand">GoPratle</p>
        <h1>Post a requirement</h1>
        <p className="rail-sub">
          Four short steps. Tell us about the event, then who you need.
        </p>
        <ol className="steps">
          {stepTitles.map((title, i) => {
            let className = "";
            if (result || i < step) className = "done";
            else if (i === step) className = "current";
            return (
              <li key={i} className={className}>
                <span className="num">
                  {className === "done" ? "✓" : i + 1}
                </span>
                {title}
              </li>
            );
          })}
        </ol>
        <Link href="/requirements" className="rail-link">
          Browse posted requirements
        </Link>
      </aside>

      {/* Right side: form */}
      <main className="panel">
        {result ? (
          // ----- Successfully saved -----
          <section className="done-card">
            <h2>Requirement posted</h2>
            <p>
              Saved under{" "}
              <strong>{CATEGORY_CONFIG[result.category].label}</strong>.
              Reference: <code>{result._id}</code>
            </p>
            <div className="actions">
              <button className="btn primary" onClick={postAnother}>
                Post another requirement
              </button>
              <Link className="btn" href="/requirements">
                View posted requirements
              </Link>
            </div>
          </section>
        ) : (
          <>
            {/* ----- Step 1: Event basics ----- */}
            {step === 0 && (
              <section>
                <h2>Event basics</h2>
                <p className="lede">What are you planning, and when?</p>
                <div className="grid">
                  <div className="field wide">
                    <label className="label" htmlFor="f-eventName">
                      Event name
                    </label>
                    <input
                      id="f-eventName"
                      value={basics.eventName}
                      placeholder="Sharma wedding reception"
                      onChange={(e) =>
                        changeBasics("eventName", e.target.value)
                      }
                    />
                    {errors.eventName && (
                      <p className="error" role="alert">
                        {errors.eventName}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="f-eventType">
                      Event type
                    </label>
                    <select
                      id="f-eventType"
                      value={basics.eventType}
                      onChange={(e) =>
                        changeBasics("eventType", e.target.value)
                      }
                    >
                      <option value="">Choose…</option>
                      {EVENT_TYPES.map((type) => (
                        <option key={type} value={type}>
                          {pretty(type)}
                        </option>
                      ))}
                    </select>
                    {errors.eventType && (
                      <p className="error" role="alert">
                        {errors.eventType}
                      </p>
                    )}
                  </div>

                  <div className="field">
                    <label className="label" htmlFor="f-location">
                      Location
                    </label>
                    <input
                      id="f-location"
                      value={basics.location}
                      placeholder="Jaipur"
                      onChange={(e) => changeBasics("location", e.target.value)}
                    />
                    {errors.location && (
                      <p className="error" role="alert">
                        {errors.location}
                      </p>
                    )}
                  </div>

                  <div className="field wide">
                    <label className="label" htmlFor="f-venue">
                      Venue <span className="optional">(optional)</span>
                    </label>
                    <input
                      id="f-venue"
                      value={basics.venue}
                      placeholder="Hotel or hall name, if you know it"
                      onChange={(e) => changeBasics("venue", e.target.value)}
                    />
                  </div>

                  <fieldset className="field wide">
                    <legend className="label">Date</legend>
                    <div className="seg">
                      <button
                        type="button"
                        aria-pressed={basics.dateMode === "single"}
                        onClick={() => changeBasics("dateMode", "single")}
                      >
                        Single day
                      </button>
                      <button
                        type="button"
                        aria-pressed={basics.dateMode === "range"}
                        onClick={() => changeBasics("dateMode", "range")}
                      >
                        Date range
                      </button>
                    </div>
                    <div className="dates">
                      <div>
                        <label className="sub" htmlFor="f-dateStart">
                          {basics.dateMode === "range"
                            ? "Starts"
                            : "Event date"}
                        </label>
                        <input
                          id="f-dateStart"
                          type="date"
                          min={todayStr()}
                          value={basics.dateStart}
                          onChange={(e) =>
                            changeBasics("dateStart", e.target.value)
                          }
                        />
                        {errors.dateStart && (
                          <p className="error" role="alert">
                            {errors.dateStart}
                          </p>
                        )}
                      </div>
                      {basics.dateMode === "range" && (
                        <div>
                          <label className="sub" htmlFor="f-dateEnd">
                            Ends
                          </label>
                          <input
                            id="f-dateEnd"
                            type="date"
                            min={basics.dateStart || todayStr()}
                            value={basics.dateEnd}
                            onChange={(e) =>
                              changeBasics("dateEnd", e.target.value)
                            }
                          />
                          {errors.dateEnd && (
                            <p className="error" role="alert">
                              {errors.dateEnd}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  </fieldset>

                  <fieldset className="field wide">
                    <legend className="label">Who do you need?</legend>
                    <div className="cats">
                      {CATEGORIES.map((c) => (
                        <button
                          type="button"
                          key={c}
                          className="cat"
                          data-cat={c}
                          aria-pressed={basics.category === c}
                          onClick={() => chooseCategory(c)}
                        >
                          <strong>{CATEGORY_CONFIG[c].label}</strong>
                          <span>{CATEGORY_CONFIG[c].blurb}</span>
                        </button>
                      ))}
                    </div>
                    {errors.category && (
                      <p className="error" role="alert">
                        {errors.category}
                      </p>
                    )}
                  </fieldset>
                </div>
              </section>
            )}

            {/* ----- Steps 2 and 3: category-specific fields ----- */}
            {(step === 1 || step === 2) && config && (
              <section>
                <h2>{config.steps[step - 1].title}</h2>
                <p className="lede">{config.steps[step - 1].description}</p>
                <Fields
                  fields={config.steps[step - 1].fields}
                  values={details}
                  errors={errors}
                  onChange={changeDetails}
                />
              </section>
            )}

            {/* ----- Step 4: Review ----- */}
            {step === 3 && config && (
              <section>
                <h2>Review and post</h2>
                <p className="lede">Check everything before it goes out.</p>

                <Review
                  title="Event basics"
                  onEdit={() => setStep(0)}
                  rows={[
                    ["Event", basics.eventName],
                    ["Type", pretty(basics.eventType)],
                    [
                      "Date",
                      basics.dateMode === "range" && basics.dateEnd
                        ? `${formatDate(basics.dateStart)} to ${formatDate(basics.dateEnd)}`
                        : formatDate(basics.dateStart),
                    ],
                    [
                      "Location",
                      basics.venue
                        ? `${basics.venue}, ${basics.location}`
                        : basics.location,
                    ],
                    ["Looking for", config.label],
                  ]}
                />

                {config.steps.map((s, i) => (
                  <Review
                    key={s.title}
                    title={s.title}
                    onEdit={() => setStep(i + 1)}
                    rows={s.fields.map((f) => [
                      f.label,
                      formatValue(f, details[f.key]),
                    ])}
                  />
                ))}

                {banner && (
                  <p className="banner" role="alert">
                    {banner}
                  </p>
                )}
              </section>
            )}

            {/* ----- Back / Continue buttons ----- */}
            <div className="footer">
              {step > 0 && (
                <button className="btn" onClick={goBack} disabled={sending}>
                  Back
                </button>
              )}
              {step < 3 ? (
                <button className="btn primary" onClick={goNext}>
                  Continue
                </button>
              ) : (
                <button
                  className="btn primary"
                  onClick={submit}
                  disabled={sending}
                >
                  {sending ? "Posting…" : "Post requirement"}
                </button>
              )}
            </div>
          </>
        )}
      </main>
    </div>
  );
}

// A box in the review step (title + rows + Edit button).
function Review({ title, rows, onEdit }) {
  return (
    <div className="review">
      <div className="review-head">
        <h3>{title}</h3>
        <button className="link" onClick={onEdit}>
          Edit
        </button>
      </div>
      <dl>
        {rows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
