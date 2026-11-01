"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import {
  CATEGORIES,
  CATEGORY_CONFIG,
  formatDate,
  formatValue,
  pretty,
} from "@/lib/config";
import { getRequirements } from "@/lib/api";

export default function RequirementsPage() {
  const [category, setCategory] = useState(""); // "" = All
  const [items, setItems] = useState(null); // null = data is still loading
  const [error, setError] = useState("");

  // Fetch data when the page loads and whenever the category changes.
  useEffect(() => {
    setItems(null);
    setError("");
    getRequirements(category)
      .then((data) => setItems(data))
      .catch((err) => setError(err.message));
  }, [category]);

  return (
    <div className="list-page">
      <header>
        <Link href="/" className="rail-link dark">
          ← Post a requirement
        </Link>
        <h1>Posted requirements</h1>
        <div className="seg">
          <button
            aria-pressed={category === ""}
            onClick={() => setCategory("")}
          >
            All
          </button>
          {CATEGORIES.map((c) => (
            <button
              key={c}
              aria-pressed={category === c}
              onClick={() => setCategory(c)}
            >
              {CATEGORY_CONFIG[c].label}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <p className="banner" role="alert">
          {error}. Please refresh and try again.
        </p>
      )}
      {!error && items === null && <p className="lede">Loading…</p>}
      {items && items.length === 0 && (
        <p className="lede">
          Nothing posted here yet.{" "}
          <Link href="/">Post the first requirement.</Link>
        </p>
      )}

      <div className="cards">
        {items &&
          items.map((item) => {
            const config = CATEGORY_CONFIG[item.category];
            // All fields for this category (Step 2 + Step 3), excluding textareas.
            const fields = [
              ...config.steps[0].fields,
              ...config.steps[1].fields,
            ].filter(
              (f) => f.type !== "textarea" && item.details[f.key] !== undefined,
            );

            return (
              <article key={item._id} className="req" data-cat={item.category}>
                <div className="req-top">
                  <span className="tag">{config.label}</span>
                  <span className="muted">{pretty(item.eventType)}</span>
                </div>
                <h2>{item.eventName}</h2>
                <p className="muted">
                  {formatDate(item.dateStart)}
                  {item.dateEnd ? ` to ${formatDate(item.dateEnd)}` : ""} ·{" "}
                  {item.venue ? `${item.venue}, ` : ""}
                  {item.location}
                </p>
                <dl>
                  {fields.map((f) => (
                    <div key={f.key}>
                      <dt>{f.label}</dt>
                      <dd>{formatValue(f, item.details[f.key])}</dd>
                    </div>
                  ))}
                </dl>
              </article>
            );
          })}
      </div>
    </div>
  );
}
