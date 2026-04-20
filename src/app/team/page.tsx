import Team from "@/components/Testimonials";
import { getTeamPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function TeamPage() {
  const lang = await getLanguageServer();
  const content = await getTeamPageSections(lang);
  return <Team content={content} />;
}
