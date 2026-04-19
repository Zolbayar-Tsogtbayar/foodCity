"use client";

import { useCallback, useEffect, useState } from "react";
import { resolvePublicMediaUrl } from "@/lib/api";

export type SalesAdItem = {
  id: string;
  title: string;
  summary?: string;
  body: string;
  imageUrl?: string;
  externalUrl?: string;
  validFrom?: string;
  validTo?: string;
  createdAt?: string;
  updatedAt?: string;
};

function formatDateMn(iso?: string | null): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString("mn-MN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return null;
  }
}

function previewText(ad: SalesAdItem, maxLen = 140): string {
  const base = (ad.summary ?? ad.body ?? "").trim();
  if (base.length <= maxLen) return base;
  return `${base.slice(0, maxLen).trim()}…`;
}

export default function SalesAdsClient({ ads }: { ads: SalesAdItem[] }) {
  const [openId, setOpenId] = useState<string | null>(null);
  const open = ads.find((a) => a.id === openId) ?? null;

  const close = useCallback(() => setOpenId(null), []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [openId, close]);

  if (ads.length === 0) {
    return (
      <p className="text-gray-500 text-center py-16 text-base">
        Одоогоор идэвхтэй зар байхгүй байна.
      </p>
    );
  }

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
        {ads.map((ad) => (
          <article
            key={ad.id}
            className="group flex flex-col overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm transition-shadow hover:shadow-md"
          >
            <button
              type="button"
              onClick={() => setOpenId(ad.id)}
              className="flex flex-1 flex-col text-left outline-none focus-visible:ring-2 focus-visible:ring-accent-500 focus-visible:ring-offset-2"
            >
              <div className="relative aspect-[16/10] w-full overflow-hidden bg-brand-900/5">
                {ad.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element -- remote CMS URLs
                  <img
                    src={resolvePublicMediaUrl(ad.imageUrl) ?? ad.imageUrl}
                    alt=""
                    className="h-full w-full object-cover transition duration-300 group-hover:scale-[1.02]"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-900">
                    <span className="text-4xl font-black text-white/20">FC</span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className="text-lg font-bold leading-snug text-brand-900 group-hover:text-accent-600 sm:text-xl">
                  {ad.title}
                </h2>
                {ad.summary && (
                  <p className="mt-1.5 text-sm font-semibold text-accent-600">{ad.summary}</p>
                )}
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {previewText(ad, 220)}
                </p>
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                  Дэлгэрэнгүй үзэх
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {open && (
        <div
          className="fixed inset-0 z-[300] flex items-end justify-center sm:items-center sm:p-4"
          role="presentation"
        >
          <button
            type="button"
            className="absolute inset-0 bg-brand-950/70 backdrop-blur-[2px]"
            aria-label="Хаах"
            onClick={close}
          />
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="sales-ad-modal-title"
            className="relative flex max-h-[min(92dvh,900px)] w-full max-w-2xl flex-col overflow-hidden rounded-t-2xl bg-white shadow-2xl sm:rounded-2xl"
          >
            <div className="flex shrink-0 items-start justify-between gap-3 border-b border-gray-100 px-5 py-4 sm:px-6">
              <h2
                id="sales-ad-modal-title"
                className="pr-8 text-xl font-bold leading-tight text-brand-900 sm:text-2xl"
              >
                {open.title}
              </h2>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-900"
                aria-label="Хаах"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto">
              {open.imageUrl && (
                <div className="relative aspect-[21/9] w-full bg-brand-900/5 sm:aspect-[2/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvePublicMediaUrl(open.imageUrl) ?? open.imageUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}

              <div className="space-y-5 px-5 py-5 sm:px-6 sm:py-6">
                {(formatDateMn(open.validFrom) ||
                  formatDateMn(open.validTo) ||
                  formatDateMn(open.createdAt)) && (
                  <dl className="grid gap-3 rounded-xl bg-gray-50 p-4 text-sm sm:grid-cols-2">
                    {formatDateMn(open.validFrom) && (
                      <div>
                        <dt className="font-medium text-gray-500">Эхлэх</dt>
                        <dd className="mt-0.5 text-gray-900">{formatDateMn(open.validFrom)}</dd>
                      </div>
                    )}
                    {formatDateMn(open.validTo) && (
                      <div>
                        <dt className="font-medium text-gray-500">Дуусах</dt>
                        <dd className="mt-0.5 text-gray-900">{formatDateMn(open.validTo)}</dd>
                      </div>
                    )}
                    {formatDateMn(open.createdAt) && (
                      <div className="sm:col-span-2">
                        <dt className="font-medium text-gray-500">Нийтлэгдсэн</dt>
                        <dd className="mt-0.5 text-gray-900">{formatDateMn(open.createdAt)}</dd>
                      </div>
                    )}
                  </dl>
                )}

                {open.summary && (
                  <p className="text-base font-semibold text-accent-600">{open.summary}</p>
                )}

                <div className="prose prose-sm max-w-none text-gray-700 sm:prose-base">
                  <p className="whitespace-pre-wrap leading-relaxed">{open.body}</p>
                </div>

                {open.externalUrl && (
                  <div className="border-t border-gray-100 pt-2">
                    <a
                      href={open.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-accent-500 px-5 py-3.5 text-center text-sm font-bold text-white shadow-sm transition hover:bg-accent-600 sm:w-auto sm:min-w-[200px]"
                    >
                      Дэлгэрэнгүй холбоос руу орох
                      <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
