import { Suspense } from "react";
import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



export default function ContactPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <ContactContent />
    </Suspense>
  );
}

async function ContactContent() {
  const lang = await getLanguageServer();
  const content = await getContactSections(lang);
  return <Contact content={content} />;
}
