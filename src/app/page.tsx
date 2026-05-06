import { Suspense } from "react";
import Hero from "@/components/Hero";
import { getHomeSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



import { notFound } from "next/navigation";

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-[80vh] bg-brand-900 animate-pulse" />}>
      <HomeContent />
    </Suspense>
  );
}

async function HomeContent() {
  const lang = await getLanguageServer();
  const content = await getHomeSections(lang);
  
  if (content.hidden) {
    notFound();
  }

  if (content.hero.hidden) {
    return null;
  }

  return <Hero hero={content.hero} />;
}
