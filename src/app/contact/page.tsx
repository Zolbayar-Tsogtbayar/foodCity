import { Suspense } from "react";
import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



import { notFound } from "next/navigation";

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

  if (content.hidden) {
    notFound();
  }

  return <Contact content={content} />;
}
