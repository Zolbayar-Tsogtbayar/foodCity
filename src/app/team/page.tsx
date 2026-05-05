import { Suspense } from "react";
import Team from "@/components/Testimonials";
import { getTeamPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default function TeamPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <TeamContent />
    </Suspense>
  );
}

async function TeamContent() {
  const lang = await getLanguageServer();
  const content = await getTeamPageSections(lang);
  return <Team content={content} />;
}
