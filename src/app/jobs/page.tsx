import { getApiBaseUrl } from "@/lib/api";
import { fetchWithTimeout } from "@/lib/server-fetch";
import JobsClient, { type JobItem } from "./JobsClient";

async function loadJobs(): Promise<JobItem[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetchWithTimeout(`${base}/api/v1/jobs`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: JobItem[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await loadJobs();

  return (
    <section className="mx-auto max-w-4xl px-4 pb-16 pt-24 sm:pt-28">
      <h1 className="mb-2 text-3xl font-bold text-brand-900">Ажлын зар</h1>
      <p className="mb-10 text-gray-600">Нээлттэй ажлын байрууд. Картыг дарж бүх мэдээллийг үзнэ үү.</p>
      <JobsClient jobs={jobs} />
    </section>
  );
}
