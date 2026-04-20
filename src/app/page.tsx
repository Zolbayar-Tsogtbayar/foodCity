import Hero from "@/components/Hero";
import { getHomeSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function Home() {
  const lang = await getLanguageServer();
  const { hero } = await getHomeSections(lang);
  return <Hero hero={hero} />;
}
