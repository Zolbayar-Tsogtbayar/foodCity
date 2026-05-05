import { Suspense } from "react";
import About from "@/components/About";
import { getAboutSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

/**
 * Validation for instant navigation. 
 * This ensures the page produces a static shell and doesn't block transitions.
 */
export const unstable_instant = { prefetch: "static" };

export default async function AboutPage() {
  const lang = await getLanguageServer();
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <AboutContent lang={lang} />
    </Suspense>
  );
}

async function AboutContent({ lang }: { lang: string }) {
  const { main } = await getAboutSections(lang);
  return <About main={main} />;
}
