import { Suspense } from "react";
import { getApiBaseUrl } from "@/lib/api";
import SalesAdsClient, {
  type SalesAdItem,
} from "@/components/sales/SalesAdsClient";
import { getSalesPageSections } from "@/lib/getSiteContent";
import { fetchWithTimeout } from "@/lib/server-fetch";
import { createFastCache } from "@/lib/fastCache";
import { getLanguageServer } from "@/lib/i18n-server";



const cachedLoadAds = createFastCache(
  "sales-ads",
  async (lang: string): Promise<SalesAdItem[]> => {
    const base = getApiBaseUrl();
    const res = await fetchWithTimeout(`${base}/api/v1/sales-ads?lang=${lang}`, {
      next: { revalidate: 1 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: SalesAdItem[] };
    return json.data ?? [];
  },
  1000, // 1 second cache
);

async function loadAds(lang: string): Promise<SalesAdItem[]> {
  try {
    return await cachedLoadAds(lang);
  } catch {
    return [];
  }
}

import { notFound } from "next/navigation";

export default function SalesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <SalesContent />
    </Suspense>
  );
}

async function SalesContent() {
  const lang = await getLanguageServer();
  const header = await getSalesPageSections(lang);

  if (header.hidden) {
    notFound();
  }

  // Use items from Site Content instead of separate API
  const ads: SalesAdItem[] = (header.items ?? [])
    .filter(it => it.active)
    .map(it => ({
      ...it,
      // Ensure all fields match SalesAdItem type
    }));

  return (
    <section className="border-b border-gray-100 bg-gradient-to-b from-brand-900/[0.03] to-white pb-16 pt-24 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4">
        {!header.header.hidden && (header.header.eyebrow || header.header.title || header.header.intro) && (
          <div className="mb-10 sm:mb-14 text-center">
            <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
              {header.header.eyebrow}
            </span>
            <h1 className="mb-4 text-3xl font-black text-brand-900 sm:text-4xl lg:text-5xl">
              {header.header.title}
            </h1>
            {header.header.intro && (
              <p className="mx-auto max-w-2xl text-base text-gray-500 sm:text-lg">
                {header.header.intro}
              </p>
            )}
          </div>
        )}

        <SalesAdsClient ads={ads} />
      </div>
    </section>
  );
}
