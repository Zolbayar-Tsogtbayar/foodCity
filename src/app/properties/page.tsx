import { Suspense } from "react";
import Properties from "@/components/Menu";
import { getPropertiesPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

export default async function PropertiesPage() {
  const lang = await getLanguageServer();
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <PropertiesContent lang={lang} />
    </Suspense>
  );
}

async function PropertiesContent({ lang }: { lang: string }) {
  const content = await getPropertiesPageSections(lang);
  return <Properties content={content} />;
}
