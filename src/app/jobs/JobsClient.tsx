"use client";

import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react";
import { createPortal } from "react-dom";
import { toast } from "react-hot-toast";
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
  Copy,
  Check,
  Send,
} from "lucide-react";
import { resolvePublicMediaUrl } from "@/lib/api";
import { useLanguage } from "@/contexts/LanguageContext";
import SubmitCVModal from "./SubmitCVModal";

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

/** 3 columns × 3 rows per page */
const JOBS_PAGE_SIZE = 9;

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

function MetaCell({ label, value, icon: Icon }: { label: string; value: ReactNode; icon: any }) {
  return (
    <div className="flex flex-1 items-center gap-3 rounded-xl border border-slate-100 bg-slate-50/30 px-4 py-3 transition-colors hover:bg-slate-50/60">
      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white shadow-sm ring-1 ring-slate-200/50">
        <Icon className="h-5 w-5 text-accent-500" />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-bold uppercase tracking-widest text-slate-400">{label}</p>
        <p className="mt-0.5 truncate text-sm font-bold text-brand-900">{value}</p>
      </div>
    </div>
  );
}

export default function JobsClient({ jobs }: { jobs: JobItem[] }) {
  const { lang, t } = useLanguage();
  const [open, setOpen] = useState<JobItem | null>(null);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [copied, setCopied] = useState(false);

  const close = useCallback(() => {
    setOpen(null);
    setIsApplyOpen(false);
  }, []);

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
      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
        {pageJobs.map((job) => {
          const posted = formatPosted(job.createdAt, lang);
          return (
            <li key={job.id} className="min-w-0">
              <button
                type="button"
                onClick={() => setOpen(job)}
                className="group flex h-full w-full min-w-0 flex-col rounded-xl border border-gray-200 bg-white text-left shadow-sm transition-all duration-300 hover:shadow-2xl hover:border-transparent focus:outline-none focus:ring-2 focus:ring-accent-500/40 overflow-hidden"
              >
                <div className="relative h-40 w-full shrink-0 overflow-hidden bg-brand-900/5 sm:h-48">
                  {job.imageUrl ? (
                    <img
                      src={resolvePublicMediaUrl(job.imageUrl) ?? job.imageUrl}
                      alt=""
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-brand-800 to-brand-900">
                      <Briefcase className="h-10 w-10 text-white/25" aria-hidden />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 h-1 bg-accent-500 z-10" />
                </div>
                
                <div className="flex flex-1 flex-col p-4 sm:p-6">
                  <h2 className="line-clamp-2 break-words text-base sm:text-lg font-bold leading-snug text-brand-900 group-hover:text-accent-500 transition-colors">
                    {job.title}
                  </h2>
                  
                  <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 border-t border-slate-50 pt-3 text-[13px] text-slate-500">
                    <span className="inline-flex items-center gap-1.5 font-medium">
                      <Building2 className="h-3.5 w-3.5 text-accent-500" />
                      {job.company}
                    </span>
                    <span className="inline-flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5 text-accent-500" />
                      {job.location}
                    </span>
                    {job.salary && (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2 py-0.5 text-[11px] font-bold text-emerald-600">
                        <Banknote className="h-3 w-3" />
                        {job.salary}
                      </span>
                    )}
                  </div>



                  <p className="mt-3 line-clamp-3 flex-1 break-words text-sm leading-relaxed text-gray-400">
                    {excerpt(job.description, 140)}
                  </p>

                  <div className="mt-4 pt-4 border-t border-gray-100">
                    <span className="inline-flex items-center gap-2 text-sm font-bold text-brand-900 group-hover:text-accent-500 transition-colors">
                      {t.jobs.labels.viewMore}
                      <svg className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M9 5l7 7-7 7" />
                      </svg>
                    </span>
                  </div>
                </div>
                <div className="h-1 bg-accent-500 w-full" />
              </button>
            </li>
          );
        })}
      </ul>

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-10">
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            ←
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              onClick={() => setPage(i + 1)}
              className={`w-8 h-8 rounded text-sm font-bold transition-colors ${i + 1 === currentPage
                  ? "bg-brand-900 text-white"
                  : "border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-brand-900"
                }`}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            →
          </button>
        </div>
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
                    <section className="rounded-2xl border border-slate-100 bg-white p-5 shadow-sm sm:p-6">
                      <h3 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-slate-400">
                        <LayoutList className="h-4 w-4 text-accent-500" aria-hidden />
                        {t.jobs.metaTitle}
                      </h3>
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch">
                        <MetaCell icon={Building2} label={t.jobs.labels.company} value={open.company} />
                        <MetaCell icon={MapPin} label={t.jobs.labels.location} value={open.location} />
                        {open.salary && (
                          <MetaCell icon={Banknote} label={t.jobs.labels.salary} value={open.salary} />
                        )}
                        {formatPosted(open.createdAt, lang) && (
                          <MetaCell icon={CalendarDays} label={t.jobs.labels.published} value={formatPosted(open.createdAt, lang)} />
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
                  </div>
                </div>
              </div>

              <footer className="flex shrink-0 items-center justify-between border-t border-slate-200/80 bg-gradient-to-t from-slate-100/50 to-slate-50/30 px-5 py-3.5 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-7">
                <button
                  type="button"
                  onClick={close}
                  className="rounded-xl border border-slate-300/90 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 shadow-sm transition hover:border-slate-400 hover:bg-slate-50 sm:w-auto sm:min-w-[140px]"
                >
                  {t.jobs.close}
                </button>
                <button
                  type="button"
                  onClick={() => setIsApplyOpen(true)}
                  className="flex items-center gap-2 rounded-xl bg-emerald-600 px-8 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-600/20 transition hover:bg-emerald-700 sm:w-auto"
                >
                  <Send className="h-4 w-4" />
                  {t.jobs.labels.apply}
                </button>
              </footer>

              {isApplyOpen && (
                <SubmitCVModal
                  jobId={open.id}
                  jobTitle={open.title}
                  lang={lang}
                  onClose={() => setIsApplyOpen(false)}
                  onSuccess={() => {
                    setIsApplyOpen(false);
                    close();
                    toast.success(lang === "mn" ? "Амжилттай илгээлээ!" : "Successfully submitted!");
                  }}
                />
              )}

            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
