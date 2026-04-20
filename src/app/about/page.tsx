import About from "@/components/About";
import { getAboutSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function AboutPage() {
  const lang = await getLanguageServer();
  const { main } = await getAboutSections(lang);
  return <About main={main} />;
}
