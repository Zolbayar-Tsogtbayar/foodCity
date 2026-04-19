/** CMS paths like `/upload/x.jpg` are proxied to the API via Next rewrites; `/images/...` stays on this app. */
export function resolveMediaUrl(src: string): string {
  if (!src) return src;
  if (/^https?:\/\//i.test(src)) {
    try {
      const u = new URL(src);
      if (u.pathname.startsWith("/upload/")) {
        return `${u.pathname}${u.search}`;
      }
    } catch {
      /* fall through */
    }
    return src;
  }
  if (src.startsWith("/upload/")) {
    return src;
  }
  return src;
}
