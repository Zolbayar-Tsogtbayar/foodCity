import About from "@/components/About";
import { getAboutSections } from "@/lib/getSiteContent";

export default async function AboutPage() {
  const { main } = await getAboutSections();
  return <About main={main} />;
}
