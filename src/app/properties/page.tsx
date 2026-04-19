import Properties from "@/components/Menu";
import { getPropertiesPageSections } from "@/lib/getSiteContent";

export default async function PropertiesPage() {
  const content = await getPropertiesPageSections();
  return <Properties content={content} />;
}
