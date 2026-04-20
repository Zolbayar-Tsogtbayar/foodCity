import { getApiBaseUrl } from "@/lib/api";
import { getJobsPageSections } from "@/lib/getSiteContent";
import { fetchWithTimeout } from "@/lib/server-fetch";
import JobsClient, { type JobItem } from "./JobsClient";

async function loadJobs(): Promise<JobItem[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetchWithTimeout(`${base}/api/v1/jobs`, {
      next: { revalidate: 5 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: JobItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const [jobs, header] = await Promise.all([loadJobs(), getJobsPageSections()]);

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:pt-28">
      <h1 className="mb-2 text-3xl font-bold text-brand-900">
        {header.header.title}
      </h1>
      <p className="mb-10 text-gray-600">{header.header.intro}</p>
      <JobsClient jobs={jobs} />
    </section>
  );
}
