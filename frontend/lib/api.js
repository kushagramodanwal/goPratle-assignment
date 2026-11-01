// Functions for communicating with the backend.
const API_URL = (
  process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000"
).replace(/\/+$/, "");
// Send a new requirement.
export async function createRequirement(data) {
  const res = await fetch(`${API_URL}/api/requirements`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const result = await res.json();

  if (!res.ok) {
    // Pass the backend error message and field errors forward.
    const error = new Error(result.message || "Request failed");
    error.fieldErrors = result.errors;
    throw error;
  }
  return result;
}

// Fetch all requirements (if a category is provided, fetch only that category).
export async function getRequirements(category) {
  const url = category
    ? `${API_URL}/api/requirements?category=${category}`
    : `${API_URL}/api/requirements`;

  const res = await fetch(url);
  const result = await res.json();

  if (!res.ok) throw new Error(result.message || "Couldn't load requirements");
  return result;
}
