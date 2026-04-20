"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  CalendarDays,
  LayoutList,
  Mail,
  MapPin,
  X,
  Banknote,
  User,
} from "lucide-react";
import { resolvePublicMediaUrl } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";

export type JobItem = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contactEmail?: string;
  imageUrl?: string;
  createdAt?: string;
  postedByDisplayName?: string;
  postedByUsername?: string;
  lastEditedByDisplayName?: string;
};

function excerpt(text: string, max = 140): string {
  const t = text.trim();
  if (t.length <= max) return t;
  return `${t.slice(0, max).trimEnd()}…`;
}

/** Two columns × two rows per page */
const JOBS_PAGE_SIZE = 4;

function formatPosted(iso?: string, lang = "mn"): string | null {
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

function MetaCell({ label, value }: { label: string; value: ReactNode }) {
  return (
    <div className="self-start rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/80 px-3 py-2 shadow-sm ring-1 ring-slate-900/[0.03]">
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{label}</p>
      <p className="mt-1 text-sm font-semibold leading-snug text-brand-900">{value}</p>
    </div>
  );
}

export default function JobsClient({ jobs }: { jobs: JobItem[] }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState<JobItem | null>(null);
  const [page, setPage] = useState(1);

  const close = useCallback(() => setOpen(null), []);

  const totalPages = Math.max(1, Math.ceil(jobs.length / JOBS_PAGE_SIZE));
  const currentPage = Math.min(Math.max(1, page), totalPages);

  const pageJobs = useMemo(() => {
    const start = (currentPage - 1) * JOBS_PAGE_SIZE;
    return jobs.slice(start, start + JOBS_PAGE_SIZE);
  }, [jobs, currentPage]);

  useEffect(() => {
    if (page !== currentPage) setPage(currentPage);
  }, [page, currentPage]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
    };
    window.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open, close]);

  if (jobs.length === 0) {
    return (
      <p className="py-12 text-center text-gray-500">
        {t.jobs.noJobs}
      </p>
    );
  }

  return (
    <>
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5">
        {pageJobs.map((job) => {
          const posted = formatPosted(job.createdAt, lang);
          return (
            <li key={job.id} className="min-w-0">
              <button
                type="button"
                onClick={() => setOpen(job)}
                className="flex h-full min-h-[320px] w-full min-w-0 flex-col rounded-xl border border-gray-100 bg-white text-left shadow-sm transition hover:border-accent-500/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-500/40"
              >
                {job.imageUrl ? (
                  <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-t-xl bg-brand-900/5">
                    {/* eslint-disable-next-line @next/next/no-img-element -- API /upload URLs */}
                    <img
                      src={resolvePublicMediaUrl(job.imageUrl) ?? job.imageUrl}
                      alt=""
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] w-full shrink-0 items-center justify-center rounded-t-xl bg-gradient-to-br from-brand-800 to-brand-900">
                    <Briefcase className="h-12 w-12 text-white/25" aria-hidden />
                  </div>
                )}
                <div className="flex min-h-0 flex-1 flex-col p-4 sm:p-5">
                  <h2 className="line-clamp-2 break-words text-lg font-semibold leading-snug text-brand-900">
                    {job.title}
                  </h2>
                  <p className="mt-2 flex flex-col gap-1 text-sm text-gray-600">
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <Building2 className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      <span className="break-words">{job.company}</span>
                    </span>
                    <span className="inline-flex min-w-0 items-center gap-1">
                      <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                      <span className="break-words">{job.location}</span>
                    </span>
                  </p>
                  {job.salary && (
                    <span className="mt-2 inline-flex w-fit max-w-full items-center gap-1.5 rounded-md border border-emerald-100/80 bg-emerald-50/90 px-2 py-0.5 text-xs font-semibold tabular-nums text-emerald-900">
                      <Banknote className="h-3 w-3 shrink-0 text-emerald-700" aria-hidden />
                      <span className="leading-none">{job.salary}</span>
                    </span>
                  )}
                  <p className="mt-3 line-clamp-3 flex-1 break-words text-sm leading-relaxed text-gray-700">
                    {excerpt(job.description, 160)}
                  </p>
                  <span className="mt-4 inline-flex text-sm font-medium text-accent-600">
                    {t.jobs.labels.viewMore}
                  </span>
                  {(posted || job.postedByDisplayName || job.lastEditedByDisplayName) && (
                    <p className="mt-2 line-clamp-2 text-xs text-gray-400">
                      {posted ? <>{t.jobs.labels.published}: {posted}</> : null}
                      {posted && (job.postedByDisplayName || job.lastEditedByDisplayName)
                        ? " · "
                        : null}
                      {job.postedByDisplayName && (
                        <span>{t.jobs.labels.poster}: {job.postedByDisplayName}</span>
                      )}
                      {job.postedByDisplayName && job.lastEditedByDisplayName ? " · " : null}
                      {job.lastEditedByDisplayName &&
                      job.lastEditedByDisplayName !== job.postedByDisplayName ? (
                        <span>{t.jobs.labels.lastEdited}: {job.lastEditedByDisplayName}</span>
                      ) : null}
                    </p>
                  )}
                </div>
              </button>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <nav
          className="mt-10 flex flex-col items-center gap-4 sm:flex-row sm:justify-center"
          aria-label={t.jobs.labels.pagination}
        >
          <div className="flex flex-wrap items-center justify-center gap-2">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.jobs.labels.prev}
            </button>
            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              className="rounded-lg border border-gray-200 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {t.jobs.labels.next}
            </button>
          </div>
          <p className="text-sm text-gray-500">
            {t.jobs.labels.page} <span className="font-medium text-brand-900">{currentPage}</span> /{" "}
            {totalPages}{" "}
            <span className="text-gray-400">
              ({jobs.length} {t.jobs.labels.adsCount})
            </span>
          </p>
        </nav>
      )}

      {typeof document !== "undefined" &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[1100] flex items-end justify-center overflow-hidden sm:items-center sm:p-5"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
          >
            <button
              type="button"
              className="absolute inset-0 bg-brand-950/75 backdrop-blur-[3px] transition-opacity hover:bg-brand-950/80"
              aria-label={t.jobs.close}
              onClick={close}
            />
            <div
              className="relative z-[1101] flex h-[min(92dvh,900px)] w-[min(100vw-1rem,1200px)] max-w-[min(100vw-1rem,1200px)] flex-col overflow-hidden rounded-t-2xl border border-slate-200/90 bg-white shadow-[0_25px_80px_-12px_rgba(15,23,42,0.35)] ring-1 ring-black/[0.04] sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <header className="relative shrink-0 overflow-hidden border-b border-slate-200/80 bg-gradient-to-br from-slate-50 via-white to-emerald-500/[0.06] px-5 py-5 sm:px-7">
                <div
                  className="pointer-events-none absolute inset-y-3 left-0 w-1 rounded-full bg-gradient-to-b from-emerald-500 to-accent-600"
                  aria-hidden
                />
                <div className="relative flex items-start justify-between gap-4 pl-3 sm:pl-4">
                  <div className="min-w-0 flex-1 space-y-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-emerald-900">
                      <Briefcase className="h-3.5 w-3.5" aria-hidden />
                      {t.jobs.category}
                    </span>
                    <h2
                      id="job-modal-title"
                      className="break-words text-xl font-bold leading-tight tracking-tight text-brand-900 sm:text-2xl lg:text-[1.65rem]"
                    >
                      {open.title}
                    </h2>
                  </div>
                  <button
                    type="button"
                    onClick={close}
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-slate-200/80 bg-white/90 text-slate-600 shadow-sm transition hover:border-slate-300 hover:bg-slate-50 hover:text-brand-900"
                    aria-label={t.jobs.close}
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
                          src={resolvePublicMediaUrl(open.imageUrl) ?? open.imageUrl}
                          alt=""
                          className="h-full w-full object-cover object-center"
                        />
                      </div>
                    ) : (
                      <div className="relative flex aspect-[16/10] min-h-[200px] flex-col items-center justify-center gap-3 bg-gradient-to-br from-brand-800 via-brand-900 to-brand-950 px-6 py-10 lg:aspect-auto lg:min-h-[min(320px,38vh)]">
                        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-20%,rgba(255,255,255,0.12),transparent)]" />
                        <Briefcase
                          className="relative h-14 w-14 text-white/30 sm:h-16 sm:w-16"
                          strokeWidth={1.25}
                          aria-hidden
                        />
                        <p className="relative text-center text-xs font-medium uppercase tracking-widest text-white/40">
                          {t.jobs.imageJob}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="min-w-0 flex-1 space-y-5">
                    <section className="rounded-2xl border border-slate-200/70 bg-gradient-to-br from-white to-slate-50/90 p-4 shadow-sm ring-1 ring-slate-900/[0.03] sm:p-5">
                      <h3 className="mb-3 flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <LayoutList className="h-4 w-4 text-emerald-600" aria-hidden />
                        {t.jobs.metaTitle}
                      </h3>
                      <div className="grid grid-cols-2 items-start gap-2 sm:grid-cols-3 lg:grid-cols-4 lg:gap-3">
                        <div className="col-span-2 flex gap-2 self-start rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-emerald-50/50 px-3 py-2 sm:col-span-1">
                          <Building2 className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {t.jobs.labels.company}
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold leading-snug text-brand-900">
                              {open.company}
                            </p>
                          </div>
                        </div>
                        <div className="col-span-2 flex gap-2 self-start rounded-xl border border-slate-200/70 bg-gradient-to-b from-white to-slate-50/80 px-3 py-2 shadow-sm sm:col-span-1">
                          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-slate-500" aria-hidden />
                          <div className="min-w-0">
                            <p className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                              {t.jobs.labels.location}
                            </p>
                            <p className="mt-1 break-words text-sm font-semibold leading-snug text-brand-900">
                              {open.location}
                            </p>
                          </div>
                        </div>
                        {open.salary ? (
                          <div className="col-span-2 flex w-fit max-w-full flex-nowrap items-center gap-2 self-start rounded-lg border border-emerald-200/90 bg-gradient-to-r from-emerald-50 to-white px-3 py-1.5 sm:col-span-1">
                            <Banknote className="h-3.5 w-3.5 shrink-0 text-emerald-700" aria-hidden />
                            <span className="shrink-0 text-[10px] font-bold uppercase leading-none tracking-wide text-emerald-800">
                              {t.jobs.labels.salary}
                            </span>
                            <span className="min-w-0 text-sm font-bold leading-none tabular-nums text-emerald-950">
                              {open.salary}
                            </span>
                          </div>
                        ) : null}
                        {formatPosted(open.createdAt, lang) ? (
                          <MetaCell label={t.jobs.labels.published} value={formatPosted(open.createdAt, lang)} />
                        ) : null}
                        {(open.postedByDisplayName || open.lastEditedByDisplayName) && (
                          <div className="col-span-2 self-start rounded-xl border border-violet-200/60 bg-gradient-to-br from-violet-50/90 to-white px-3 py-2.5 shadow-sm sm:col-span-1 lg:col-span-2">
                            <p className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-violet-600/90">
                              <User className="h-3.5 w-3.5" aria-hidden />
                              {t.jobs.labels.admin}
                            </p>
                            <div className="mt-1 text-sm font-semibold text-brand-900">
                              {open.postedByDisplayName && (
                                <div>{t.jobs.labels.poster}: {open.postedByDisplayName}</div>
                              )}
                              {open.lastEditedByDisplayName &&
                              open.lastEditedByDisplayName !== open.postedByDisplayName ? (
                                <div className="mt-0.5 text-xs font-medium text-slate-500">
                                  {t.jobs.labels.lastEdited}: {open.lastEditedByDisplayName}
                                </div>
                              ) : null}
                            </div>
                          </div>
                        )}
                      </div>
                    </section>

                    <section className="rounded-2xl border border-slate-200/70 bg-white p-4 shadow-sm ring-1 ring-slate-900/[0.03] sm:p-5">
                      <h3 className="mb-3 flex items-center gap-2 border-b border-slate-100 pb-2 text-xs font-bold uppercase tracking-wider text-slate-500">
                        <CalendarDays className="h-4 w-4 text-accent-600" aria-hidden />
                        {t.jobs.descriptionTitle}
                      </h3>
                      <div className="break-words whitespace-pre-wrap text-sm leading-relaxed text-slate-700 sm:text-[15px]">
                        {open.description}
                      </div>
                    </section>

                    {open.contactEmail ? (
                      <div className="rounded-2xl border border-slate-200/60 bg-gradient-to-br from-slate-50 to-white p-4 sm:p-5">
                        <a
                          href={`mailto:${open.contactEmail}?subject=${encodeURIComponent(`Job Inquiry: ${open.title}`)}`}
                          className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-accent-500 to-accent-600 px-4 py-3.5 text-center text-sm font-bold text-white shadow-md shadow-accent-500/20 transition hover:from-accent-600 hover:to-accent-700 sm:inline-flex sm:flex-row sm:min-w-[260px] sm:px-5"
                        >
                          <span className="inline-flex items-center gap-2">
                            <Mail className="h-5 w-5 shrink-0" aria-hidden />
                            {t.jobs.labels.sendEmail}
                          </span>
                          <span className="max-w-full break-all text-xs font-normal opacity-95 sm:text-sm">
                            {open.contactEmail}
                          </span>
                        </a>
                        <p className="mt-3 text-center text-xs leading-relaxed text-slate-500 sm:text-left">
                          {t.jobs.labels.emailHint}
                        </p>
                      </div>
                    ) : null}
                  </div>
                </div>
              </div>

              <footer className="flex shrink-0 items-center justify-end border-t border-slate-200/80 bg-gradient-to-t from-slate-100/50 to-slate-50/30 px-5 py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-7">
                <button
                  type="button"
                  onClick={close}
                  className="w-full rounded-xl border border-slate-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:min-w-[140px]"
                >
                  {t.jobs.close}
                </button>
              </footer>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
