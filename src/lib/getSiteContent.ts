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

/**
 * Server-only: call the API on loopback when front + API run on the same host (PM2).
 * Avoids slow/outbound requests to the public domain during SSR (DNS + nginx + hairpin).
 * Override with SITE_CONTENT_API_URL if the API is remote.
 */
function getApiBaseForServer(): string {
  return (
    process.env.SITE_CONTENT_API_URL ??
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000"
  );
}

type ApiSitePage = {
  sections?: unknown;
};

const REVALIDATE_SECONDS = 120;

const fetchSitePageSections = cache(async (pageId: string): Promise<unknown> => {
  try {
    const res = await fetch(
      `${getApiBaseForServer()}/api/v1/site-pages/${pageId}`,
      {
        next: { revalidate: REVALIDATE_SECONDS },
      },
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
