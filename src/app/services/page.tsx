import Services from "@/components/Services";
import { getServicesSections } from "@/lib/getSiteContent";

export default async function ServicesPage() {
  const content = await getServicesSections();
  return <Services content={content} />;
}
