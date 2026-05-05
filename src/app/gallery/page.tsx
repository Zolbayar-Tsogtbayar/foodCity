import { Suspense } from "react";
import Gallery from "@/components/Gallery";
import { getGallerySections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const unstable_instant = { prefetch: "static" };

export default async function GalleryPage() {
  const lang = await getLanguageServer();
  
  return (
    <Suspense fallback={<div className="min-h-screen bg-white animate-pulse" />}>
      <GalleryContent lang={lang} />
    </Suspense>
  );
}

async function GalleryContent({ lang }: { lang: string }) {
  const content = await getGallerySections(lang);
  return <Gallery content={content} />;
}
