import Properties from "@/components/Menu";
import { getPropertiesPageSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function PropertiesPage() {
  const lang = await getLanguageServer();
  const content = await getPropertiesPageSections(lang);
  return <Properties content={content} />;
}
