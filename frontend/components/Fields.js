"use client";

// Fields for Step 2 and Step 3 are displayed here.
// fields = list received from config, values = values entered so far,
// errors = validation errors, onChange = function called when a value changes
export default function Fields({ fields, values, errors, onChange }) {
  return (
    <div className="grid">
      {fields.map((field) => {
        const id = "f-" + field.key;
        const value = values[field.key];
        const error = errors[field.key];
        const errorText = error ? (
          <p className="error" role="alert">
            {error}
          </p>
        ) : null;

        // Chips (multiple options can be selected)
        if (field.type === "multi") {
          const selected = Array.isArray(value) ? value : [];

          const toggle = (optionValue) => {
            if (selected.includes(optionValue)) {
              onChange(
                field.key,
                selected.filter((item) => item !== optionValue),
              ); // Remove the option.
            } else {
              onChange(field.key, [...selected, optionValue]); // Add the option.
            }
          };

          return (
            <fieldset key={field.key} className="field wide">
              <legend className="label">{field.label}</legend>
              <div className="chips">
                {field.options.map((option) => (
                  <button
                    type="button"
                    key={option.value}
                    className="chip"
                    aria-pressed={selected.includes(option.value)}
                    onClick={() => toggle(option.value)}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
              {errorText}
            </fieldset>
          );
        }

        // Checkbox
        if (field.type === "boolean") {
          return (
            <div key={field.key} className="field check">
              <input
                id={id}
                type="checkbox"
                checked={value === true}
                onChange={(e) => onChange(field.key, e.target.checked)}
              />
              <label htmlFor={id}>{field.label}</label>
            </div>
          );
        }

        // All other fields (select, textarea, text, number, time) with a label
        let input;

        if (field.type === "select") {
          input = (
            <select
              id={id}
              value={value || ""}
              onChange={(e) => onChange(field.key, e.target.value)}
            >
              <option value="">Choose…</option>
              {field.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          );
        } else if (field.type === "textarea") {
          input = (
            <textarea
              id={id}
              rows={3}
              value={value || ""}
              placeholder={field.placeholder}
              onChange={(e) => onChange(field.key, e.target.value)}
            />
          );
        } else {
          // text / number / time
          input = (
            <div className="affix">
              {field.prefix && <span className="pre">{field.prefix}</span>}
              <input
                id={id}
                type={field.type} // "text", "number" or "time"
                value={value || ""}
                placeholder={field.placeholder}
                onChange={(e) => onChange(field.key, e.target.value)}
              />
              {field.suffix && <span className="suf">{field.suffix}</span>}
            </div>
          );
        }

        return (
          <div key={field.key} className={field.wide ? "field wide" : "field"}>
            <label htmlFor={id} className="label">
              {field.label}
              {field.optional && <span className="optional"> (optional)</span>}
            </label>
            {input}
            {errorText}
          </div>
        );
      })}
    </div>
  );
}
