export const API_BASE =
  (import.meta as any).env?.VITE_API_URL ||
  (import.meta as any).env?.VITE_SERVER_URL ||
  "http://localhost:3001";

export function authHeaders() {
  const token = localStorage.getItem("access_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function refreshAccessToken() {
  const rt = localStorage.getItem("refresh_token");
  if (!rt) throw new Error("No refresh_token");
  const res = await fetch(`${API_BASE}/api/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: rt }),
  });
  if (!res.ok) throw new Error("Refresh failed");
  const data = await res.json();
  if (data?.access_token) {
    localStorage.setItem("access_token", data.access_token);
    return data.access_token as string;
  }
  throw new Error("No access_token in refresh response");
}

async function request<T>(path: string, init: RequestInit, retry = true): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, init);
  if (res.status === 401 && retry) {
    try {
      await refreshAccessToken();
      const headers = new Headers(init.headers as any);
      const token = localStorage.getItem("access_token");
      if (token) headers.set("Authorization", `Bearer ${token}`);
      return request<T>(path, { ...init, headers }, false);
    } catch (e) {
      // clear tokens and bubble up
      localStorage.removeItem("access_token");
      // keep refresh_token for potential manual retry, or clear it if desired
      throw new Error(await res.text());
    }
  }
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}

export async function apiGet<T>(path: string): Promise<T> {
  return request<T>(path, { headers: { "Content-Type": "application/json", ...authHeaders() } });
}

export async function apiPost<T>(path: string, body: any): Promise<T> {
  return request<T>(path, {
    method: "POST",
    headers: { "Content-Type": "application/json", ...authHeaders() },
    body: JSON.stringify(body),
  });
}
