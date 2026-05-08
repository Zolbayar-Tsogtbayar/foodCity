import { Suspense } from "react";
import About from "@/components/About";
import { getAboutSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

/**
 * Validation for instant navigation.
 * This ensures the page produces a static shell and doesn't block transitions.
 */

import { notFound } from "next/navigation";

export default function AboutPage() {
  return (
    <Suspense
      fallback={<div className="min-h-screen bg-white animate-pulse" />}
    >
      <AboutContent />
    </Suspense>
  );
}

async function AboutContent() {
  const lang = await getLanguageServer();
  const content = await getAboutSections(lang);

  if (content.hidden) {
    notFound();
  }

  return <About main={content.main} />;
}
