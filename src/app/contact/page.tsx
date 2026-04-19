import Contact from "@/components/Contact";
import { getContactSections } from "@/lib/getSiteContent";

export default async function ContactPage() {
  const content = await getContactSections();
  return <Contact content={content} />;
}
