import Gallery from "@/components/Gallery";
import { getGallerySections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  const lang = await getLanguageServer();
  const content = await getGallerySections(lang);
  
  return <Gallery content={content} />;
}
