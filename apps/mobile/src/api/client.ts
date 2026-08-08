// Single place the app talks to the Go backend from. Never call fetch()
// directly from screens/components — go through here so auth headers,
// base URL, and error handling stay in one place.
//
// Once `npm run gen:types` has been run against the backend's OpenAPI spec,
// import generated types from "./types.gen" here for full request/response
// typing instead of the `unknown` placeholders below.

import { API_BASE_URL } from "@env";

let authToken: string | null = null;

export function setAuthToken(token: string | null) {
  authToken = token;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(authToken ? { Authorization: `Bearer ${authToken}` } : {}),
      ...init?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error ${res.status}: ${await res.text()}`);
  }
  return res.json() as Promise<T>;
}

export const api = {
  health: () => request<{ status: string }>("/health"),
  me: () => request<{ user_id: string }>("/api/v1/me"),
};
