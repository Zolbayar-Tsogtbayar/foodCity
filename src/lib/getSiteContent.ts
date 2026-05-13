import { cache } from "react";
import type {
  AboutSections,
  ContactSections,
  FooterSections,
  HomeSections,
  JobsPageSections,
  ProjectsPageSections,
  PropertiesPageSections,
  SalesPageSections,
  GallerySections,
  TeamPageSections,
} from "./site-content-types";
import {
  fetchWithTimeout,
  SERVER_FETCH_TIMEOUT_MS,
  type NextFetchInit,
} from "./server-fetch";

/**
 * Server-side CMS base (not necessarily the same as the browser's NEXT_PUBLIC_API_URL).
 * Falls back to loopback for local builds when env is unset.
 * Strips trailing `/api` since callers already append `/api/v1/…`.
 */
function getApiBaseForServer(): string {
  let url = (
    process.env.SITE_CONTENT_API_URL ??
    process.env.API_INTERNAL_URL ??
    process.env.NEXT_PUBLIC_API_URL ??
    "http://127.0.0.1:4000"
  ).trim().replace(/\/+$/, "");
  if (url.endsWith("/api")) {
    url = url.slice(0, -4);
  }
  return url;
}

function skipFetch(): boolean {
  const v = process.env.SKIP_SITE_CONTENT_FETCH;
  return v === "1" || v === "true";
}

type ApiSitePage = {
  sections?: unknown;
};

const EMPTY_HOME: HomeSections = {
  hidden: false,
  hero: {

    slideImages: [],
    badge: "",
    titleLine1: "",
    titleAccent: "",
    titleLine2: "",
    desc: "",
    btn1: "",
    btn1Href: "",
    btn2: "",
    btn2Href: "",
    stats: [],
    slideLabel: "",
  },
};
const EMPTY_ABOUT: AboutSections = {
  hidden: false,
  main: {

    sectionLabel: "",
    h2Line1: "",
    h2Accent: "",
    p1: "",
    p2: "",
    imageUrl: "",
    imageBuildingName: "",
    imageBuildingSubtitle: "",
    yearsBadgeValue: "",
    yearsLabel: "",
    stats: [],
  },
};
const EMPTY_FOOTER: FooterSections = {
  logo: "",
  partners: { partnersLabel: "", items: [] },
  brand: { desc: "" },
  socials: [],
  sections: [],
  copyright: "© 2026 FoodCity ХХК. Бүх эрх хуулиар хамгаалагдсан.",
};

const EMPTY_CONTACT: ContactSections = {
  hero: { badge: "", h2Accent: "", intro: "" },
  items: [],
  agent: { initials: "", name: "", role: "", telHref: "", telLabel: "" },
  formTitle: "",
  links: [],
};
const EMPTY_SERVICES: GallerySections = {
  header: { badge: "", h2Line1: "", h2Accent: "", intro: "" },
  features: [],
  banner: [],
  slides: [],
};
const EMPTY_PROPERTIES_PAGE: PropertiesPageSections = {
  header: { badge: "", titleLine1: "", titleAccent: "", intro: "" },
  categories: [],
  items: [],
  cta: { href: "", label: "" },
};
const EMPTY_PROJECTS_PAGE: ProjectsPageSections = {
  hidden: false,
  header: { badge: "", titleLine1: "", titleAccent: "", intro: "" },
  items: [],
};


const EMPTY_SALES_PAGE: SalesPageSections = {
  header: { eyebrow: "", title: "", intro: "" },
  items: [],
};
const EMPTY_JOBS_PAGE: JobsPageSections = {
  header: { title: "", intro: "" },
  items: [],
};
const EMPTY_TEAM_PAGE: TeamPageSections = {
  header: { eyebrow: "", h2Line1: "", h2Accent: "", intro: "" },
  members: [],
  cta: { title: "", subtitle: "", buttonLabel: "", buttonHref: "" },
};

const REVALIDATE_SECONDS = 60;

const fetchSitePageSectionsRaw = cache(async (pageId: string, lang: string = "mn"): Promise<unknown> => {
  if (skipFetch()) return {};

  const isDev = process.env.NODE_ENV === "development";
  const fetchInit: NextFetchInit = isDev
    ? { cache: "no-store" }
    : {
      next: {
        revalidate: REVALIDATE_SECONDS,
        tags: ["site-content"],
      },
    };

  try {
    const res = await fetchWithTimeout(
      `${getApiBaseForServer()}/api/v1/site-pages/${pageId}?lang=${lang}`,
      fetchInit,
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

/**
 * Fetches sections for the given lang. If the result is empty (no MN data yet),
 * automatically falls back to the other language so pages are never blank.
 */
function isEmptySections(v: unknown): boolean {
  if (!v || typeof v !== "object" || Array.isArray(v)) return true;
  return Object.keys(v as object).length === 0;
}

async function fetchSitePageSections(pageId: string, lang: string = "mn"): Promise<unknown> {
  const primary = await fetchSitePageSectionsRaw(pageId, lang);
  if (!isEmptySections(primary)) return primary;
  // Fallback to the other language
  const fallbackLang = lang === "mn" ? "en" : "mn";
  return fetchSitePageSectionsRaw(pageId, fallbackLang);
}

function asRecord(v: unknown): Record<string, unknown> {
  return v && typeof v === "object" && !Array.isArray(v)
    ? (v as Record<string, unknown>)
    : {};
}

export async function getHomeSections(lang: string = "mn"): Promise<HomeSections> {
  const patch = asRecord(await fetchSitePageSections("home", lang));
  const hero = asRecord(patch.hero);
  return {
    hidden: !!patch.hidden,
    hero: {
      ...EMPTY_HOME.hero,

      ...hero,
      slideImages: Array.isArray(hero.slideImages) ? (hero.slideImages as string[]) : [],
      stats: Array.isArray(hero.stats) ? (hero.stats as { value: string; label: string }[]) : [],
    },
  };
}

export async function getAboutSections(lang: string = "mn"): Promise<AboutSections> {
  const patch = asRecord(await fetchSitePageSections("about", lang));
  const main = asRecord(patch.main);
  return {
    hidden: !!patch.hidden,
    main: {

      ...EMPTY_ABOUT.main,
      ...main,
      stats: Array.isArray(main.stats) ? (main.stats as { value: string; label: string }[]) : [],
    },
  };
}

export async function getFooterSections(lang: string = "mn"): Promise<FooterSections> {
  const patch = asRecord(await fetchSitePageSections("footer", lang));
  const partners = asRecord(patch.partners);
  return {
    hidden: !!patch.hidden,
    logo: typeof patch.logo === "string" ? patch.logo : EMPTY_FOOTER.logo,

    partners: {
      ...EMPTY_FOOTER.partners,
      ...partners,
      items: Array.isArray(partners.items) ? (partners.items as FooterSections["partners"]["items"]) : [],
    },
    brand: { ...EMPTY_FOOTER.brand, ...asRecord(patch.brand) },
    socials: Array.isArray(patch.socials) ? (patch.socials as FooterSections["socials"]) : EMPTY_FOOTER.socials,
    sections: Array.isArray(patch.sections) ? (patch.sections as FooterSections["sections"]) : EMPTY_FOOTER.sections,
    copyright: typeof patch.copyright === "string" ? patch.copyright : EMPTY_FOOTER.copyright,
    copyrightHidden: !!patch.copyrightHidden,
  };
}


export async function getContactSections(lang: string = "mn"): Promise<ContactSections> {
  const patch = asRecord(await fetchSitePageSections("contact", lang));
  return {
    hidden: !!patch.hidden,
    navbarPhoneLabel: typeof patch.navbarPhoneLabel === "string" ? patch.navbarPhoneLabel.trim() : "",
    navbarPhoneHref: typeof patch.navbarPhoneHref === "string" ? patch.navbarPhoneHref.trim() : "",
    hero: { ...EMPTY_CONTACT.hero, ...asRecord(patch.hero) },

    items: Array.isArray(patch.items) ? (patch.items as ContactSections["items"]) : [],
    agent: { ...EMPTY_CONTACT.agent, ...asRecord(patch.agent) },
    formTitle: typeof patch.formTitle === "string" ? patch.formTitle : "",
    links: Array.isArray(patch.links)
      ? (patch.links as Record<string, unknown>[]).map((l) => ({
        type: typeof l.type === "string" ? l.type : "",
        href: typeof l.href === "string" ? l.href : "",
        title: typeof l.title === "string" ? l.title : "",
        imageUrl: typeof l.imageUrl === "string" ? l.imageUrl : undefined,
        hidden: !!l.hidden,
        subLinks: Array.isArray(l.subLinks)
          ? (l.subLinks as Record<string, unknown>[]).map((sl) => ({
            type: typeof sl.type === "string" ? sl.type : "",
            label: typeof sl.label === "string" ? sl.label : "",
            href: typeof sl.href === "string" ? sl.href : "",
          }))
          : undefined,
      }))
      : [],
  };
}

export async function getGallerySections(lang: string = "mn"): Promise<GallerySections> {
  const patch = asRecord(await fetchSitePageSections("gallery", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_SERVICES.header, ...asRecord(patch.header) },

    features: Array.isArray(patch.features)
      ? (patch.features as Record<string, unknown>[]).map((f) => ({
        title: typeof f.title === "string" ? f.title : "",
        desc: typeof f.desc === "string" ? f.desc : "",
        image: typeof f.image === "string" ? f.image : "",
        images: Array.isArray(f.images) ? (f.images as string[]) : [],
        videoUrl: typeof f.videoUrl === "string" ? f.videoUrl : undefined,
        date: typeof f.date === "string" ? f.date : undefined,
        hidden: !!f.hidden,
      }))
      : [],
    banner: Array.isArray(patch.banner) ? (patch.banner as GallerySections["banner"]) : [],
    slides: Array.isArray(patch.slides) ? (patch.slides as string[]) : [],
  };
}

export async function getPropertiesPageSections(lang: string = "mn"): Promise<PropertiesPageSections> {
  const patch = asRecord(await fetchSitePageSections("properties-page", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_PROPERTIES_PAGE.header, ...asRecord(patch.header) },

    categories: Array.isArray(patch.categories) ? (patch.categories as string[]) : [],
    items: Array.isArray(patch.items)
      ? (patch.items as Record<string, unknown>[]).map((item) => ({
        id: typeof item.id === "number" ? item.id : 0,
        name: typeof item.name === "string" ? item.name : "",
        image: typeof item.image === "string" ? item.image : "",
        category: typeof item.category === "string" ? item.category : "",
        badge: typeof item.badge === "string" ? item.badge : null,
        size: typeof item.size === "string" ? item.size : "",
        floor: typeof item.floor === "string" ? item.floor : "",
        parking: typeof item.parking === "string" ? item.parking : "",
        price: typeof item.price === "string" ? item.price : "",
        tag: typeof item.tag === "string" ? item.tag : "",
        description: typeof item.description === "string" ? item.description : "",
        images: Array.isArray(item.images) ? (item.images as string[]) : [],
      }))
      : [],
    cta: { ...EMPTY_PROPERTIES_PAGE.cta, ...asRecord(patch.cta) },
  };
}

export async function getProjectsPageSections(lang: string = "mn"): Promise<ProjectsPageSections> {
  const patch = asRecord(await fetchSitePageSections("projects-page", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_PROJECTS_PAGE.header, ...asRecord(patch.header) },
    items: Array.isArray(patch.items) ? (patch.items as ProjectsPageSections["items"]) : [],
  };
}
export async function getPagesMetadata(lang: string = "mn"): Promise<{ pageId: string; hidden: boolean }[]> {
  const isDev = process.env.NODE_ENV === "development";
  const fetchInit: NextFetchInit = isDev ? { cache: "no-store" } : { next: { revalidate: REVALIDATE_SECONDS, tags: ["site-content"] } };
  try {
    const res = await fetchWithTimeout(`${getApiBaseForServer()}/api/v1/site-pages?lang=${lang}`, fetchInit, SERVER_FETCH_TIMEOUT_MS);
    if (!res.ok) return [];
    const json = (await res.json()) as { data?: { pageId: string; hidden: boolean }[] };
    return json.data || [];
  } catch {
    return [];
  }
}


export async function getSalesPageSections(lang: string = "mn"): Promise<SalesPageSections> {
  const patch = asRecord(await fetchSitePageSections("sales-page", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_SALES_PAGE.header, ...asRecord(patch.header) },
    items: Array.isArray(patch.items)
      ? (patch.items as Record<string, unknown>[]).map((it) => ({
        id: String(it.id || ""),
        title: String(it.title || ""),
        summary: String(it.summary || ""),
        body: String(it.body || ""),
        badge: String(it.badge || ""),
        imageUrl: String(it.imageUrl || ""),
        externalUrl: it.externalUrl ? String(it.externalUrl) : undefined,
        active: it.active !== false,
      }))
      : [],
  };
}

export async function getJobsPageSections(lang: string = "mn"): Promise<JobsPageSections> {
  const patch = asRecord(await fetchSitePageSections("jobs-page", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_JOBS_PAGE.header, ...asRecord(patch.header) },
    items: Array.isArray(patch.items)
      ? (patch.items as Record<string, unknown>[]).map((it) => ({
        id: String(it.id || ""),
        title: String(it.title || ""),
        company: String(it.company || ""),
        location: String(it.location || ""),
        description: String(it.description || ""),
        salary: it.salary ? String(it.salary) : undefined,
        contactEmail: it.contactEmail ? String(it.contactEmail) : undefined,
        imageUrl: it.imageUrl ? String(it.imageUrl) : undefined,
        active: it.active !== false,
      }))
      : [],
  };
}

export async function getTeamPageSections(lang: string = "mn"): Promise<TeamPageSections> {
  const patch = asRecord(await fetchSitePageSections("team", lang));
  return {
    hidden: !!patch.hidden,
    header: { ...EMPTY_TEAM_PAGE.header, ...asRecord(patch.header) },
    members: Array.isArray(patch.members) ? (patch.members as TeamPageSections["members"]) : [],
    cta: { ...EMPTY_TEAM_PAGE.cta, ...asRecord(patch.cta) },
  };
}
