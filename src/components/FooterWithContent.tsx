import { getFooterSections } from "@/lib/getSiteContent";
import Footer from "@/components/Footer";

export default async function FooterWithContent() {
  const content = await getFooterSections();
  return <Footer content={content} />;
}
