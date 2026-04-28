import Projects from "@/components/Projects";
import { getProjectsPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function ProjectsPage() {
  const lang = await getLanguageServer();
  const content = await getProjectsPageSections(lang);
  return <Projects content={content} />;
}
