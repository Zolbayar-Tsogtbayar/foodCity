import { getPagesMetadata, getContactSections } from "@/lib/getSiteContent";
import Navbar from "@/components/Navbar";
import { getLanguageServer } from "@/lib/i18n-server";

export default async function NavbarWithContent() {
  const lang = await getLanguageServer();
  const [metadata, contact] = await Promise.all([
    getPagesMetadata(lang),
    getContactSections(lang),
  ]);
  const hiddenPageIds = metadata.filter((m) => m.hidden).map((m) => m.pageId);
  
  return (
    <Navbar 
      hiddenPageIds={hiddenPageIds} 
      phoneNumber={contact.navbarPhoneLabel || contact.navbarPhoneHref || contact.agent?.telLabel}
      phoneHref={contact.navbarPhoneHref || contact.agent?.telHref}
    />
  );
}
