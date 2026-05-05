import { Suspense } from "react";
import Gallery from "@/components/Gallery";
import { getGallerySections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

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
  return <Gallery content={content} />;
}
