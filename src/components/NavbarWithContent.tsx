import { getPagesMetadata } from "@/lib/getSiteContent";
import Navbar from "@/components/Navbar";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function NavbarWithContent() {
  const lang = await getLanguageServer();
  const metadata = await getPagesMetadata(lang);
  const hiddenPageIds = metadata.filter((m) => m.hidden).map((m) => m.pageId);
  return <Navbar hiddenPageIds={hiddenPageIds} />;
}
