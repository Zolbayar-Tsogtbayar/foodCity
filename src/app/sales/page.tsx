import { getApiBaseUrl } from "@/lib/api";
import SalesAdsClient, {
  type SalesAdItem,
} from "@/components/sales/SalesAdsClient";
import { getSalesPageSections } from "@/lib/getSiteContent";
import { fetchWithTimeout } from "@/lib/server-fetch";
import { createFastCache } from "@/lib/fastCache";

const cachedLoadAds = createFastCache(
  "sales-ads",
  async (): Promise<SalesAdItem[]> => {
    const base = getApiBaseUrl();
    const res = await fetchWithTimeout(`${base}/api/v1/sales-ads`, {
      next: { revalidate: 1 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: SalesAdItem[] };
    return json.data ?? [];
  },
  1000, // 1 second cache
);

async function loadAds(): Promise<SalesAdItem[]> {
  try {
    return await cachedLoadAds();
  } catch {
    return [];
  }
}

export default async function SalesPage() {
  const [ads, header] = await Promise.all([loadAds(), getSalesPageSections()]);

  return (
    <section className="border-b border-gray-100 bg-gradient-to-b from-brand-900/[0.03] to-white pb-16 pt-24 sm:pt-28">
      <div className="mx-auto max-w-5xl px-4">
        <div className="mb-10 text-center sm:mb-12 sm:text-left">
          <p className="mb-2 text-xs font-semibold uppercase tracking-widest text-accent-600">
            {header.header.eyebrow}
          </p>
          <h1 className="text-3xl font-black text-brand-900 sm:text-4xl">
            {header.header.title}
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-gray-600 sm:mx-0">
            {header.header.intro}
          </p>
        </div>

        <SalesAdsClient ads={ads} />
      </div>
    </section>
  );
}
