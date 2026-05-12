import { Suspense } from "react";
import { getApiBaseUrl } from "@/lib/api";
import { getJobsPageSections } from "@/lib/getSiteContent";
import { fetchWithTimeout } from "@/lib/server-fetch";
import JobsClient, { type JobItem } from "./JobsClient";
import { createFastCache } from "@/lib/fastCache";
import { getLanguageServer } from "@/lib/i18n-server";



const cachedLoadJobs = createFastCache(
  "jobs-data",
  async (lang: string): Promise<JobItem[]> => {
    const base = getApiBaseUrl();
    const res = await fetchWithTimeout(`${base}/api/v1/jobs?lang=${lang}`, {
      next: { revalidate: 1 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: JobItem[] };
    return json.data ?? [];
  },
  1000, // 1 second cache
);

async function loadJobs(lang: string): Promise<JobItem[]> {
  try {
    return await cachedLoadJobs(lang);
  } catch {
    return [];
  }
}

import { notFound } from "next/navigation";

export default function JobsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <JobsContent />
    </Suspense>
  );
}

async function JobsContent() {
  const lang = await getLanguageServer();
  const header = await getJobsPageSections(lang);

  if (header.hidden) {
    notFound();
  }

  // Use items from Site Content instead of separate API
  const jobs: JobItem[] = (header.items ?? [])
    .filter(it => it.active)
    .map(it => ({
      ...it,
      // Ensure all fields match JobItem type
    }));

  return (
    <section className="mx-auto max-w-6xl px-4 pb-16 pt-24 sm:pt-28">
      {!header.header.hidden && (header.header.title || header.header.intro) && (
        <>
          <h1 className="mb-2 text-3xl font-bold text-brand-900">
            {header.header.title}
          </h1>
          <p className="mb-10 text-gray-600">{header.header.intro}</p>
        </>
      )}
      <JobsClient jobs={jobs} />
    </section>
  );
}
