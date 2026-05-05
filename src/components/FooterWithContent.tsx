import { getFooterSections, getPagesMetadata } from "@/lib/getSiteContent";
import Footer from "@/components/Footer";
import { getLanguageServer } from "@/lib/i18n-server";
import { translations } from "@/lib/translations";

export default async function FooterWithContent() {
  const lang = await getLanguageServer();
  const [content, metadata] = await Promise.all([
    getFooterSections(lang),
    getPagesMetadata(lang),
  ]);
  const hiddenPageIds = metadata.filter((m: { hidden: boolean }) => m.hidden).map((m: { pageId: string }) => m.pageId);
  const t = translations[lang];
  return <Footer content={content} t={t} hiddenPageIds={hiddenPageIds} />;
}
