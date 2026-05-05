import { Suspense } from "react";
import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

export default async function ContactPage() {
  const lang = await getLanguageServer();
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <ContactContent lang={lang} />
    </Suspense>
  );
}

async function ContactContent({ lang }: { lang: string }) {
  const content = await getContactSections(lang);
  return <Contact content={content} />;
}
