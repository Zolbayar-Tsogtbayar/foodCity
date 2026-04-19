/**
 * Bounded wait for upstream APIs during `next build` / SSR when the API is down.
 * Without this, TCP to 127.0.0.1 can stall until the OS timeout (~60s) and fails static generation.
 * Keep this high enough for cold DB / first request after deploy (100ms was aborting real traffic).
 */
export const SERVER_FETCH_TIMEOUT_MS = 10_000;

export type NextFetchInit = RequestInit & {
  next?: { revalidate?: number | false; tags?: string[] };
};

function timeoutSignal(ms: number): AbortSignal {
  const AS = AbortSignal as unknown as { timeout?: (n: number) => AbortSignal };
  if (typeof AS.timeout === "function") {
    return AS.timeout(ms);
  }
  const c = new AbortController();
  setTimeout(() => c.abort(), ms);
  return c.signal;
}

export function fetchWithTimeout(
  url: string,
  init: NextFetchInit = {},
  timeoutMs: number = SERVER_FETCH_TIMEOUT_MS,
): Promise<Response> {
  return fetch(url, {
    ...init,
    signal: timeoutSignal(timeoutMs),
  });
}
