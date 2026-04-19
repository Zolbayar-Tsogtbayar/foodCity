import Team from "@/components/Testimonials";
import { getTeamPageSections } from "@/lib/getSiteContent";

export default async function TeamPage() {
  const content = await getTeamPageSections();
  return <Team content={content} />;
}
