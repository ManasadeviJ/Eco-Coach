// lib/apiClient.js
export async function apiPost(path, body) {
  const res = await fetch(path, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body || {})
  });
  const json = await res.json();
  if (!res.ok) {
    const err = new Error(json?.error?.message || json?.error || "API Error");
    err.details = json;
    throw err;
  }
  return json;
}
