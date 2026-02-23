const API_URL = process.env.NEXT_PUBLIC_API_URL;

export async function apiFetch<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_URL}${endpoint}`, {
    headers: {
      "Content-Type": "application/json",
    },
    ...options,
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(errorText || "API Error");
  }

  return res.json();
}

export async function apiFetchBlob(
  endpoint: string
): Promise<Blob> {
  const res = await fetch(`${API_URL}${endpoint}`);

  if (!res.ok) {
    throw new Error("Failed to download file");
  }

  return res.blob();
}
