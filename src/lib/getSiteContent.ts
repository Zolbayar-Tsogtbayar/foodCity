import { cache } from "react";
import { fetchWithTimeout } from "./server-fetch";
import { mergeDeep } from "./mergeDeep";
import {
  defaultAboutSections,
  defaultContactSections,
  defaultFooterSections,
  defaultHomeSections,
  defaultServicesSections,
} from "./site-content-defaults";
import type {
  AboutSections,
  ContactSections,
  FooterSections,
  HomeSections,
  ServicesSections,
} from "./site-content-types";

/**
 * Server-only CMS/API base. Intentionally does NOT use NEXT_PUBLIC_API_URL — that var is
 * for the browser (chat, etc.) and is often set to the public domain, which would make
 * every local `npm run dev` SSR hit the internet on each navigation (very slow).
 *
 * Local: defaults to loopback. Production on same host: set SITE_CONTENT_API_URL=http://127.0.0.1:4000
 * or rely on default. Remote API: set SITE_CONTENT_API_URL to that origin.
 */
function getApiBaseForServer(): string {
  return (
    process.env.SITE_CONTENT_API_URL ??
    process.env.API_INTERNAL_URL ??
    "http://127.0.0.1:4000"
  );
}

function fetchTimeoutMs(): number {
  return process.env.NODE_ENV === "development" ? 1500 : 8000;
}

function shouldSkipSiteContentFetch(): boolean {
  const v = process.env.SKIP_SITE_CONTENT_FETCH;
  return v === "1" || v === "true";
}

type ApiSitePage = {
  sections?: unknown;
};

const REVALIDATE_SECONDS = 120;

const fetchSitePageSections = cache(async (pageId: string): Promise<unknown> => {
  if (shouldSkipSiteContentFetch()) return {};

  try {
    const res = await fetchWithTimeout(
      `${getApiBaseForServer()}/api/v1/site-pages/${pageId}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      },
      fetchTimeoutMs(),
    );
    if (!res.ok) return {};
    const json = (await res.json()) as { data?: ApiSitePage };
    return json.data?.sections && typeof json.data.sections === "object"
      ? json.data.sections
      : {};
  } catch {
    return {};
  }
});

export async function getHomeSections(): Promise<HomeSections> {
  const patch = await fetchSitePageSections("home");
  return mergeDeep(defaultHomeSections, patch);
}

export async function getAboutSections(): Promise<AboutSections> {
  const patch = await fetchSitePageSections("about");
  return mergeDeep(defaultAboutSections, patch);
}

export async function getFooterSections(): Promise<FooterSections> {
  const patch = await fetchSitePageSections("footer");
  return mergeDeep(defaultFooterSections, patch);
}

export async function getContactSections(): Promise<ContactSections> {
  const patch = await fetchSitePageSections("contact");
  return mergeDeep(defaultContactSections, patch);
}

export async function getServicesSections(): Promise<ServicesSections> {
  const patch = await fetchSitePageSections("services");
  return mergeDeep(defaultServicesSections, patch);
}
