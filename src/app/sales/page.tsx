import { getApiBaseUrl } from "@/lib/api";
import { fetchWithTimeout } from "@/lib/server-fetch";

type Ad = {
  id: string;
  title: string;
  summary?: string;
  body: string;
  imageUrl?: string;
  externalUrl?: string;
  createdAt?: string;
};

async function loadAds(): Promise<Ad[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetchWithTimeout(`${base}/api/v1/sales-ads`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: Ad[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function SalesPage() {
  const ads = await loadAds();

  return (
    <section className="pt-24 sm:pt-28 pb-16 px-4 max-w-5xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-900 mb-2">Борлуулалтын зар</h1>
      <p className="text-gray-600 mb-10">
        Хямдрал, урамшуулал, шинэ нээлтийн мэдээллийг эндээс үзнэ үү.
      </p>
      <div className="grid gap-8 md:grid-cols-2">
        {ads.map((ad) => (
          <article
            key={ad.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
          >
            {ad.imageUrl && (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ad.imageUrl}
                alt=""
                className="w-full h-48 object-cover"
              />
            )}
            <div className="p-6 flex-1 flex flex-col">
              <h2 className="text-xl font-semibold text-brand-900 mb-2">{ad.title}</h2>
              {ad.summary && (
                <p className="text-accent-600 font-medium text-sm mb-2">{ad.summary}</p>
              )}
              <p className="text-gray-700 text-sm whitespace-pre-wrap flex-1">{ad.body}</p>
              {ad.externalUrl && (
                <a
                  href={ad.externalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-4 inline-flex text-sm font-medium text-accent-600 hover:text-accent-700"
                >
                  Дэлгэрэнгүй холбоос →
                </a>
              )}
            </div>
          </article>
        ))}
      </div>
      {ads.length === 0 && (
        <p className="text-gray-500 text-center py-12">Одоогоор идэвхтэй зар байхгүй байна.</p>
      )}
    </section>
  );
}
