import { getApiBaseUrl } from "@/lib/api";
import { fetchWithTimeout } from "@/lib/server-fetch";

type Job = {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary?: string;
  contactEmail?: string;
};

async function loadJobs(): Promise<Job[]> {
  const base = getApiBaseUrl();
  try {
    const res = await fetchWithTimeout(`${base}/api/v1/jobs`, {
      next: { revalidate: 30 },
    });
    if (!res.ok) return [];
    const json = (await res.json()) as { data: Job[] };
    return json.data ?? [];
  } catch {
    return [];
  }
}

export default async function JobsPage() {
  const jobs = await loadJobs();

  return (
    <section className="pt-24 sm:pt-28 pb-16 px-4 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-brand-900 mb-2">Ажлын зар</h1>
      <p className="text-gray-600 mb-10">Нээлттэй ажлын байрууд.</p>
      <ul className="space-y-6">
        {jobs.map((job) => (
          <li
            key={job.id}
            className="bg-white rounded-xl border border-gray-100 shadow-sm p-6"
          >
            <h2 className="text-xl font-semibold text-brand-900">{job.title}</h2>
            <p className="text-gray-600 text-sm mt-1">
              {job.company} · {job.location}
            </p>
            {job.salary && (
              <p className="text-accent-600 font-medium text-sm mt-2">{job.salary}</p>
            )}
            <p className="text-gray-700 text-sm mt-4 whitespace-pre-wrap">{job.description}</p>
            {job.contactEmail && (
              <a
                href={`mailto:${job.contactEmail}`}
                className="inline-block mt-4 text-sm font-medium text-accent-600 hover:text-accent-700"
              >
                {job.contactEmail} — имэйл илгээх
              </a>
            )}
          </li>
        ))}
      </ul>
      {jobs.length === 0 && (
        <p className="text-gray-500 text-center py-12">Одоогоор идэвхтэй зар байхгүй байна.</p>
      )}
    </section>
  );
}
