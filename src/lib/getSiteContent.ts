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

function getApiBase(): string {
  return process.env.NEXT_PUBLIC_API_URL ?? "http://bukhbatllc.mn";
}

type ApiSitePage = {
  sections?: unknown;
};

async function fetchSitePageSections(pageId: string): Promise<unknown> {
  try {
    const res = await fetch(`${getApiBase()}/api/v1/site-pages/${pageId}`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return {};
    const json = (await res.json()) as { data?: ApiSitePage };
    return json.data?.sections && typeof json.data.sections === "object"
      ? json.data.sections
      : {};
  } catch {
    return {};
  }
}

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
