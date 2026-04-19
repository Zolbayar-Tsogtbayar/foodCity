import { cache } from "react";
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
import { fetchWithTimeout, SERVER_FETCH_TIMEOUT_MS } from "./server-fetch";

/**
 * Server-side CMS base (not necessarily the same as the browser’s NEXT_PUBLIC_API_URL).
 * Falls back to loopback for local builds when env is unset.
 */
function getApiBaseForServer(): string {
  return (
    process.env.SITE_CONTENT_API_URL ??
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000"
  );
}

function skipFetch(): boolean {
  const v = process.env.SKIP_SITE_CONTENT_FETCH;
  return v === "1" || v === "true";
}

type ApiSitePage = {
  sections?: unknown;
};

const REVALIDATE_SECONDS = 30;

const fetchSitePageSections = cache(async (pageId: string): Promise<unknown> => {
  if (skipFetch()) return {};

  try {
    const res = await fetchWithTimeout(
      `${getApiBaseForServer()}/api/v1/site-pages/${pageId}`,
      { next: { revalidate: REVALIDATE_SECONDS } },
      SERVER_FETCH_TIMEOUT_MS,
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
