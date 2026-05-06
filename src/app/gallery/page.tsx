import { Suspense } from "react";
import Gallery from "@/components/Gallery";
import { getGallerySections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";



import { notFound } from "next/navigation";

export default function GalleryPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <GalleryContent />
    </Suspense>
  );
}

async function GalleryContent() {
  const lang = await getLanguageServer();
  const content = await getGallerySections(lang);

  if (content.hidden) {
    notFound();
  }

  return <Gallery content={content} />;
}
