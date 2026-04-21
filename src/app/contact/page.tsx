import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function ContactPage() {
  const lang = await getLanguageServer();
  const content = await getContactSections(lang);
  return <Contact content={content} />;
}
