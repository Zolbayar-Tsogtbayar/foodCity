import { Suspense } from "react";
import Hero from "@/components/Hero";
import { getHomeSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] bg-brand-900 animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const lang = await getLanguageServer();
  const { hero } = await getHomeSections(lang);
  return <Hero hero={hero} />;
}
