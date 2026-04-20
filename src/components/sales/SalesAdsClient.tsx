"use client";

import { useCallback, useEffect, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { CalendarDays, Megaphone, X } from "lucide-react";
import { resolvePublicMediaUrl } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

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
  postedByDisplayName?: string;
  postedByUsername?: string;
  lastEditedByDisplayName?: string;
};

function formatDate(iso?: string | null, lang = "mn"): string | null {
  if (!iso) return null;
  try {
    const d = new Date(iso);
    if (Number.isNaN(d.getTime())) return null;
    return d.toLocaleDateString(lang === "mn" ? "mn-MN" : "en-US", {
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

function MetaCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="self-start rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/80 px-3 py-2 shadow-sm ring-1 ring-slate-900/[0.03]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p className="mt-1 text-sm font-semibold leading-snug text-brand-900">
        {value}
      </p>
    </div>
  );
}

const SM = 640;

function usePageSize(mobile: number, desktop: number) {
  const [size, setSize] = useState(() =>
    typeof window !== "undefined" && window.innerWidth >= SM ? desktop : mobile,
  );
  useEffect(() => {
    const mq = window.matchMedia(`(min-width: ${SM}px)`);
    const handler = (e: MediaQueryListEvent) =>
      setSize(e.matches ? desktop : mobile);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, [mobile, desktop]);
  return size;
}

export default function SalesAdsClient({ ads }: { ads: SalesAdItem[] }) {
  const { lang, t } = useLanguage();
  const [openId, setOpenId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const pageSize = usePageSize(4, 9);

  const totalPages = Math.ceil(ads.length / pageSize);
  const paged = ads.slice(page * pageSize, page * pageSize + pageSize);

  useEffect(() => {
    setPage(0);
  }, [pageSize]);

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
      <p className="text-gray-500 text-center py-16 text-base">{t.sales.noAds}</p>
    );
  }

  const hasMeta =
    formatDate(open?.validFrom, lang) ||
    formatDate(open?.validTo, lang) ||
    formatDate(open?.createdAt, lang) ||
    open?.postedByDisplayName ||
    open?.lastEditedByDisplayName;

  const modal =
    typeof document !== "undefined" &&
    open &&
    createPortal(
      <div
        className="fixed inset-0 z-[1100] flex items-end justify-center overflow-hidden sm:items-center sm:p-5"
        role="dialog"
        aria-modal="true"
        aria-labelledby="sales-ad-modal-title"
      >
        <button
          type="button"
          className="absolute inset-0 bg-brand-950/75 backdrop-blur-[3px] transition-opacity hover:bg-brand-950/80"
          aria-label={t.sales.close}
          onClick={close}
        />
        <div
          className="relative z-[1101] flex h-[min(92dvh,900px)] w-[min(100vw-1rem,1200px)] max-w-[min(100vw-1rem,1200px)] flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.04] sm:rounded-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <header className="relative shrink-0 overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-accent-500/[0.07] px-5 py-5 sm:px-7">
            <div
              className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b from-accent-500 to-accent-600"
              aria-hidden
            />
            <div className="relative flex items-start justify-between gap-4 pl-3 sm:pl-4">
              <div className="min-w-0 flex-1 space-y-2">
                <span className="inline-flex items-center gap-1.5 rounded-full border border-accent-500/20 bg-accent-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-accent-800">
                  <Megaphone className="h-3.5 w-3.5" aria-hidden />
                  {t.sales.category}
                </span>
                <h2
                  id="sales-ad-modal-title"
                  className="text-xl font-bold leading-tight tracking-tight text-brand-900 sm:text-2xl lg:text-[1.65rem]"
                >
                  {open.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-brand-900"
                aria-label={t.sales.close}
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto overscroll-contain bg-gradient-to-b from-slate-100/40 via-white to-white">
            <div className="flex flex-col gap-6 px-5 py-6 sm:px-7 lg:flex-row lg:items-stretch lg:gap-8">
              <div className="relative w-full shrink-0 overflow-hidden rounded-2xl border border-slate-200/60 bg-slate-100 shadow-inner ring-1 ring-slate-900/[0.04] lg:sticky lg:top-0 lg:w-[min(420px,42%)] lg:self-start">
                {open.imageUrl ? (
                  <div className="aspect-[16/10] w-full lg:aspect-auto lg:max-h-[min(380px,42vh)] lg:min-h-[220px]">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={
                        resolvePublicMediaUrl(open.imageUrl) ?? open.imageUrl
                      }
                      alt=""
                      className="h-full w-full object-cover object-center"
                    />
                  </div>
                ) : (
                  <div className="relative flex aspect-[16/10] min-h-[200px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-10 lg:aspect-auto lg:min-h-[min(320px,38vh)]">
                    <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.12),transparent)]" />
                    <Megaphone
                      className="relative h-14 w-14 text-white/30 sm:h-16 sm:w-16"
                      strokeWidth={1.25}
                    />
                    <p className="relative text-center text-xs font-medium uppercase tracking-widest text-white/40">
                      {t.sales.imageAd}
                    </p>
                  </div>
                )}
              </div>

              <div className="min-w-0 flex-1 space-y-5">
                {hasMeta ? (
                  <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/90 p-4 shadow-sm ring-1 ring-slate-900/[0.03] sm:p-5">
                    <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                      <CalendarDays
                        className="h-4 w-4 text-accent-600"
                        aria-hidden
                      />
                      {t.sales.metaTitle}
                    </h3>
                    <div className="grid grid-cols-2 items-start gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
                      {formatDate(open.validFrom, lang) && (
                        <MetaCell
                          label={t.sales.labels.start}
                          value={formatDate(open.validFrom, lang)}
                        />
                      )}
                      {formatDate(open.validTo, lang) && (
                        <MetaCell
                          label={t.sales.labels.end}
                          value={formatDate(open.validTo, lang)}
                        />
                      )}
                      {formatDate(open.createdAt, lang) && (
                        <MetaCell
                          label={t.sales.labels.published}
                          value={formatDate(open.createdAt, lang)}
                        />
                      )}
                      {(open.postedByDisplayName ||
                        open.lastEditedByDisplayName) && (
                        <div className="col-span-2 self-start rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-white px-3 py-2.5 shadow-sm sm:col-span-1 lg:col-span-2">
                          <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600/90">
                            {t.sales.labels.admin}
                          </p>
                          <div className="mt-1 text-sm font-semibold text-brand-900">
                            {open.postedByDisplayName && (
                              <div>
                                {t.sales.labels.poster}: {open.postedByDisplayName}
                              </div>
                            )}
                            {open.lastEditedByDisplayName &&
                            open.lastEditedByDisplayName !==
                              open.postedByDisplayName ? (
                              <div className="mt-0.5 text-xs font-medium text-slate-500">
                                {t.sales.labels.lastEdited}: {open.lastEditedByDisplayName}
                              </div>
                            ) : null}
                          </div>
                        </div>
                      )}
                    </div>
                  </section>
                ) : null}

                {open.summary ? (
                  <p className="rounded-xl border border-accent-500/15 bg-accent-500/[0.06] px-4 py-3 text-base font-semibold leading-snug text-accent-800">
                    {open.summary}
                  </p>
                ) : null}

                <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03] sm:p-5">
                  <h3 className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                    <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-brand-900/5 text-[10px] font-black text-brand-800">
                      FC
                    </span>
                    {t.sales.labels.content}
                  </h3>
                  <div className="prose prose-sm max-w-none text-slate-700 prose-p:leading-relaxed sm:prose-base">
                    <p className="whitespace-pre-wrap">{open.body}</p>
                  </div>
                </section>

                {open.externalUrl ? (
                  <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-r from-slate-50 to-white p-4 sm:p-5">
                    <a
                      href={open.externalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-5 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-accent-500/25 transition hover:from-accent-600 hover:to-accent-700 sm:w-auto sm:min-w-[240px]"
                    >
                      {t.sales.labels.externalLink}
                      <svg
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                        />
                      </svg>
                    </a>
                  </div>
                ) : null}
              </div>
            </div>
          </div>

          <footer className="flex shrink-0 items-center justify-end gap-3 border-t border-slate-200/80 bg-gradient-to-t from-slate-100/50 to-slate-50/30 px-5 py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-7">
            <button
              type="button"
              onClick={close}
              className="w-full rounded-xl border border-slate-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:min-w-[140px]"
            >
              {t.sales.close}
            </button>
          </footer>
        </div>
      </div>,
      document.body,
    );

  return (
    <>
      <div className="grid gap-6 sm:grid-cols-2 lg:gap-8">
        {paged.map((ad) => (
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
                    <span className="text-4xl font-black text-white/20">
                      FC
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col p-5 sm:p-6">
                <h2 className="text-lg font-bold leading-snug text-brand-900 group-hover:text-accent-600 sm:text-xl">
                  {ad.title}
                </h2>
                {ad.summary && (
                  <p className="mt-1.5 text-sm font-semibold text-accent-600">
                    {ad.summary}
                  </p>
                )}
                <p className="mt-3 line-clamp-3 flex-1 text-sm leading-relaxed text-gray-600">
                  {previewText(ad, 220)}
                </p>
                {(ad.postedByDisplayName || ad.lastEditedByDisplayName) && (
                  <p className="mt-3 text-xs text-gray-500">
                    {ad.postedByDisplayName && (
                      <span>{t.sales.labels.poster}: {ad.postedByDisplayName}</span>
                    )}
                    {ad.postedByDisplayName && ad.lastEditedByDisplayName
                      ? " · "
                      : null}
                    {ad.lastEditedByDisplayName &&
                    ad.lastEditedByDisplayName !== ad.postedByDisplayName ? (
                      <span>{t.sales.labels.lastEdited}: {ad.lastEditedByDisplayName}</span>
                    ) : null}
                  </p>
                )}
                <span className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-accent-600">
                  {t.sales.labels.viewMore}
                  <svg
                    className="h-4 w-4"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                </span>
              </div>
            </button>
          </article>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 0}
            className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                i === page
                  ? "bg-accent-500 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-accent-400 hover:text-accent-500"
              }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages - 1}
            className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
      )}

      {modal}
    </>
  );
}
