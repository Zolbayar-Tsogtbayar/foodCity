export const DEFAULT_API = "http://localhost:4000";

/**
 * Base URL for foodcity-back (no trailing slash, no trailing `/api`).
 * All fetch calls already append `/api/v1/…`, so if the env var ends with
 * `/api` (common reverse-proxy setup) we strip it automatically.
 */
export function getApiBaseUrl(): string {
  let url = (process.env.NEXT_PUBLIC_API_URL ?? DEFAULT_API).trim().replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

/**
 * Socket.io is mounted on the HTTP server root (`/socket.io/`), not under `/api/v1`.
 * If `NEXT_PUBLIC_API_URL` ends with `/api`, use the origin without it for `io()`.
 */
export function getSocketBaseUrl(): string {
  let u = getApiBaseUrl().replace(/\/$/, "");
  if (u.endsWith("/api")) {
    u = u.slice(0, -4);
  }
  return u;
}

/**
 * URL for API-hosted uploads (`/upload/…`) in `<img src>`.
 * Returns a **same-origin** path (`/upload/…`) so the browser loads the marketing site origin;
 * `next.config.mjs` rewrites that to the real API (see `UPLOAD_PROXY_ORIGIN`).
 * Normalizes stored absolute URLs on the API host to that path.
 */
export function resolvePublicMediaUrl(url: string | undefined | null): string | undefined {
  if (url == null) return undefined;
  const p = String(url).trim();
  if (!p) return undefined;
  // Common CMS/API variants: `upload/x.jpg` should behave like `/upload/x.jpg`
  // so Next rewrites can proxy it correctly from the marketing site origin.
  if (p.startsWith("upload/")) {
    return `/${p}`;
  }
  if (/^https?:\/\//i.test(p)) {
    try {
      const u = new URL(p);
      if (u.pathname.startsWith("/upload/")) {
        return `${u.pathname}${u.search}`;
      }
    } catch {
      /* keep absolute */
    }
    return p;
  }
  if (p.startsWith("/upload/")) {
    return p;
  }
  return p;
}

export type ChatMessage = {
  id: string;
  role: "user" | "bot" | "agent";
  text: string;
  createdAt?: string;
};
