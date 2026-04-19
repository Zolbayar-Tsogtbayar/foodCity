export const DEFAULT_API = "http://localhost:4000";

export function getApiBaseUrl(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API;
}

/** Resolves API-hosted uploads (`/upload/…`) to an absolute URL for `<img src>`. */
export function resolvePublicMediaUrl(url: string | undefined | null): string | undefined {
  if (url == null) return undefined;
  const p = String(url).trim();
  if (!p) return undefined;
  if (/^https?:\/\//i.test(p)) return p;
  if (p.startsWith("/upload/")) {
    return `${getApiBaseUrl().replace(/\/$/, "")}${p}`;
  }
  return p;
}

export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "agent";
  text: string;
  createdAt?: string;
};
