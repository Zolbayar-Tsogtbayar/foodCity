import { Suspense } from "react";
import Projects from "@/components/Projects";
import { getProjectsPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

export default async function ProjectsPage() {
  const lang = await getLanguageServer();
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <ProjectsContent lang={lang} />
    </Suspense>
  );
}

async function ProjectsContent({ lang }: { lang: string }) {
  const content = await getProjectsPageSections(lang);
  return <Projects content={content} />;
}
