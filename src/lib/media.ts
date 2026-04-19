import { getApiBaseUrl } from "./api";

/** CMS paths like `/upload/x.jpg` are served by the API; same-origin paths like `/images/...` stay as-is. */
export function resolveMediaUrl(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) return src;
  if (src.startsWith("/upload/")) {
    const base = getApiBaseUrl().replace(/\/$/, "");
    return `${base}${src}`;
  }
  return src;
}
