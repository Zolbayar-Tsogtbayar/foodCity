import { Suspense } from "react";
import Projects from "@/components/Projects";
import { getProjectsPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



export default function ProjectsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <ProjectsContent />
    </Suspense>
  );
}

async function ProjectsContent() {
  const lang = await getLanguageServer();
  const content = await getProjectsPageSections(lang);
  return <Projects content={content} />;
}
