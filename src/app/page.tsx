import Hero from "@/components/Hero";
import { getHomeSections } from "@/lib/getSiteContent";

export default async function Home() {
  const { hero } = await getHomeSections();
  return <Hero hero={hero} />;
}
