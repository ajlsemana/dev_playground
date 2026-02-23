export function buildQuery(params: Record<string, any>) {
  const sp = new URLSearchParams();

  Object.entries(params).forEach(([key, value]) => {
    if (value === undefined || value === null) return;
    const v = typeof value === "string" ? value.trim() : value;
    if (v === "") return;
    sp.set(key, String(v));
  });

  return sp.toString();
}