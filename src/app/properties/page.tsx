import { Suspense } from "react";
import Properties from "@/components/Menu";
import { getPropertiesPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



import { notFound } from "next/navigation";

export default function PropertiesPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <PropertiesContent />
    </Suspense>
  );
}

async function PropertiesContent() {
  const lang = await getLanguageServer();
  const content = await getPropertiesPageSections(lang);

  if (content.hidden) {
    notFound();
  }

  return <Properties content={content} />;
}
