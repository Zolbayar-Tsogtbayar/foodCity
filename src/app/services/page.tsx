import Services from "@/components/Services";
import { getServicesSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function ServicesPage() {
  const lang = await getLanguageServer();
  const content = await getServicesSections(lang);
  return <Services content={content} />;
}
