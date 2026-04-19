"use client";

import { useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import {
  Briefcase,
  Building2,
  Mail,
  MapPin,
  X,
  Calendar,
  Banknote,
  User,
} from "lucide-react";
import { resolvePublicMediaUrl } from "@/lib/api";

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

function formatPosted(iso?: string): string | null {
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

export default function JobsClient({ jobs }: { jobs: JobItem[] }) {
  const [open, setOpen] = useState<JobItem | null>(null);
  const [mounted, setMounted] = useState(false);

  const close = useCallback(() => setOpen(null), []);

  useEffect(() => {
    setMounted(true);
  }, []);

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
        Одоогоор идэвхтэй зар байхгүй байна.
      </p>
    );
  }

  return (
    <>
      <ul className="space-y-4">
        {jobs.map((job) => {
          const posted = formatPosted(job.createdAt);
          return (
            <li key={job.id}>
              <button
                type="button"
                onClick={() => setOpen(job)}
                className="w-full min-w-0 rounded-xl border border-gray-100 bg-white p-4 text-left shadow-sm transition hover:border-accent-500/30 hover:shadow-md focus:outline-none focus:ring-2 focus:ring-accent-500/40 sm:p-5"
              >
                <div className="flex flex-col gap-3 sm:flex-row sm:items-stretch sm:justify-between sm:gap-4">
                  {job.imageUrl ? (
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-lg bg-brand-900/5 sm:aspect-auto sm:h-24 sm:w-36">
                      {/* eslint-disable-next-line @next/next/no-img-element -- API /upload URLs */}
                      <img
                        src={resolvePublicMediaUrl(job.imageUrl) ?? job.imageUrl}
                        alt=""
                        className="h-full w-full object-cover sm:object-cover"
                      />
                    </div>
                  ) : (
                    <div className="flex h-24 w-full shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-brand-800 to-brand-900 sm:w-36">
                      <Briefcase className="h-10 w-10 text-white/25" aria-hidden />
                    </div>
                  )}
                  <div className="min-w-0 flex-1">
                    <h2 className="break-words text-lg font-semibold text-brand-900 sm:text-xl">
                      {job.title}
                    </h2>
                    <p className="mt-1 flex flex-col gap-1 text-sm text-gray-600 sm:flex-row sm:flex-wrap sm:items-center sm:gap-x-2 sm:gap-y-0.5">
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <Building2 className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="break-words">{job.company}</span>
                      </span>
                      <span className="hidden text-gray-300 sm:inline">·</span>
                      <span className="inline-flex min-w-0 items-center gap-1">
                        <MapPin className="h-3.5 w-3.5 shrink-0 opacity-70" aria-hidden />
                        <span className="break-words">{job.location}</span>
                      </span>
                    </p>
                  </div>
                  {job.salary && (
                    <span className="inline-flex w-fit shrink-0 items-center gap-1 self-start rounded-lg bg-emerald-50 px-2.5 py-1 text-sm font-medium text-emerald-800 sm:self-auto">
                      <Banknote className="h-3.5 w-3.5 shrink-0" aria-hidden />
                      <span className="break-words">{job.salary}</span>
                    </span>
                  )}
                </div>
                <p className="mt-3 line-clamp-2 break-words text-sm leading-relaxed text-gray-700">
                  {excerpt(job.description, 180)}
                </p>
                <span className="mt-4 inline-flex text-sm font-medium text-accent-600">
                  Дэлгэрэнгүй үзэх →
                </span>
                {(posted || job.postedByDisplayName || job.lastEditedByDisplayName) && (
                  <p className="mt-2 text-xs text-gray-400">
                    {posted ? <>Нийтэлсэн: {posted}</> : null}
                    {posted && (job.postedByDisplayName || job.lastEditedByDisplayName)
                      ? " · "
                      : null}
                    {job.postedByDisplayName && (
                      <span>Нийтлэгч: {job.postedByDisplayName}</span>
                    )}
                    {job.postedByDisplayName && job.lastEditedByDisplayName ? " · " : null}
                    {job.lastEditedByDisplayName &&
                    job.lastEditedByDisplayName !== job.postedByDisplayName ? (
                      <span>Сүүлд зассан: {job.lastEditedByDisplayName}</span>
                    ) : null}
                  </p>
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {mounted &&
        open &&
        createPortal(
          <div
            className="fixed inset-0 z-[600] flex items-end justify-center overflow-x-hidden overflow-y-auto overscroll-contain sm:items-center sm:p-4"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-modal-title"
          >
            <button
              type="button"
              className="fixed inset-0 bg-black/50 backdrop-blur-[2px]"
              aria-label="Хаах"
              onClick={close}
            />
            <div
              className="relative z-10 flex max-h-[min(92dvh,720px)] w-full min-w-0 max-w-2xl flex-col overflow-hidden rounded-t-2xl border border-gray-100 bg-white shadow-2xl sm:mx-4 sm:rounded-2xl"
              onClick={(e) => e.stopPropagation()}
            >
            <div className="flex shrink-0 items-start justify-between gap-2 border-b border-gray-100 px-4 py-3 sm:gap-3 sm:px-6 sm:py-4">
              <div className="min-w-0 flex-1 pr-1">
                <p className="text-xs font-medium uppercase tracking-wide text-gray-500">
                  Ажлын зар
                </p>
                <h2
                  id="job-modal-title"
                  className="mt-1 break-words text-xl font-bold leading-snug text-brand-900 sm:text-2xl"
                >
                  {open.title}
                </h2>
              </div>
              <button
                type="button"
                onClick={close}
                className="shrink-0 rounded-lg p-2 text-gray-500 transition hover:bg-gray-100 hover:text-gray-800"
                aria-label="Хаах"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-4 sm:px-6">
              {open.imageUrl && (
                <div className="relative mb-5 aspect-[21/9] w-full overflow-hidden rounded-xl bg-brand-900/5 sm:aspect-[2/1]">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={resolvePublicMediaUrl(open.imageUrl) ?? open.imageUrl}
                    alt=""
                    className="h-full w-full object-cover object-center"
                  />
                </div>
              )}
              <dl className="space-y-3 text-sm">
                <div className="flex min-w-0 gap-3 rounded-xl bg-gray-50 px-3 py-3 sm:px-4">
                  <Building2 className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Байгууллага
                    </dt>
                    <dd className="mt-0.5 break-words font-medium text-brand-900">{open.company}</dd>
                  </div>
                </div>
                <div className="flex min-w-0 gap-3 rounded-xl bg-gray-50 px-3 py-3 sm:px-4">
                  <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
                  <div className="min-w-0">
                    <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Байршил
                    </dt>
                    <dd className="mt-0.5 break-words font-medium text-brand-900">{open.location}</dd>
                  </div>
                </div>
                {open.salary && (
                  <div className="flex min-w-0 gap-3 rounded-xl bg-emerald-50/80 px-3 py-3 ring-1 ring-emerald-100 sm:px-4">
                    <Banknote className="mt-0.5 h-5 w-5 shrink-0 text-emerald-700" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-emerald-800/90">
                        Цалин
                      </dt>
                      <dd className="mt-0.5 break-words font-semibold text-emerald-900">{open.salary}</dd>
                    </div>
                  </div>
                )}
                {formatPosted(open.createdAt) && (
                  <div className="flex min-w-0 gap-3 rounded-xl bg-gray-50 px-3 py-3 sm:px-4">
                    <Calendar className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Нийтэлсэн
                      </dt>
                      <dd className="mt-0.5 break-words text-brand-900">{formatPosted(open.createdAt)}</dd>
                    </div>
                  </div>
                )}
                {(open.postedByDisplayName || open.lastEditedByDisplayName) && (
                  <div className="flex min-w-0 gap-3 rounded-xl bg-gray-50 px-3 py-3 sm:px-4">
                    <User className="mt-0.5 h-5 w-5 shrink-0 text-gray-500" aria-hidden />
                    <div className="min-w-0">
                      <dt className="text-xs font-medium uppercase tracking-wide text-gray-500">
                        Админ
                      </dt>
                      <dd className="mt-0.5 break-words text-brand-900">
                        {open.postedByDisplayName && (
                          <span>Нийтлэгч: {open.postedByDisplayName}</span>
                        )}
                        {open.postedByDisplayName && open.lastEditedByDisplayName ? " · " : null}
                        {open.lastEditedByDisplayName &&
                        open.lastEditedByDisplayName !== open.postedByDisplayName ? (
                          <span>Сүүлд зассан: {open.lastEditedByDisplayName}</span>
                        ) : null}
                      </dd>
                    </div>
                  </div>
                )}
              </dl>

              <div className="mt-6">
                <h3 className="flex items-center gap-2 text-sm font-semibold text-brand-900">
                  <Briefcase className="h-4 w-4 text-accent-600" aria-hidden />
                  Дэлгэрэнгүй
                </h3>
                <div className="mt-3 break-words whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
                  {open.description}
                </div>
              </div>

              {open.contactEmail && (
                <div className="mt-8 border-t border-gray-100 pt-6">
                  <a
                    href={`mailto:${open.contactEmail}?subject=${encodeURIComponent(`Ажлын зар: ${open.title}`)}`}
                    className="flex w-full flex-col items-center justify-center gap-2 rounded-xl bg-accent-500 px-3 py-3.5 text-center text-sm font-semibold text-white shadow-sm transition hover:bg-accent-600 sm:inline-flex sm:flex-row sm:min-w-[240px] sm:px-4"
                  >
                    <span className="inline-flex items-center gap-2">
                      <Mail className="h-5 w-5 shrink-0" aria-hidden />
                      Имэйл илгээх
                    </span>
                    <span className="max-w-full break-all text-xs font-normal opacity-95 sm:text-sm">
                      {open.contactEmail}
                    </span>
                  </a>
                  <p className="mt-2 text-xs text-gray-500">
                    Таны имэйл програмыг нээж, анхны захиалгыг бөглөх болно.
                  </p>
                </div>
              )}
            </div>

            <div className="shrink-0 border-t border-gray-100 px-4 py-3 pb-[max(0.75rem,env(safe-area-inset-bottom))] sm:px-6 sm:pb-3">
              <button
                type="button"
                onClick={close}
                className="w-full rounded-lg border border-gray-200 py-2.5 text-sm font-medium text-gray-700 transition hover:bg-gray-50 sm:w-auto sm:px-8"
              >
                Хаах
              </button>
            </div>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}
