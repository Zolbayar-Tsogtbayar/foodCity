import { cookies } from "next/headers";
import { Lang } from "./translations";

/**
 * Server-only utility to get the current language from cookies.
 * Defaults to "mn".
 */
export async function getLanguageServer(): Promise<Lang> {
  const cookieStore = await cookies();
  const lang = cookieStore.get("lang")?.value;
  if (lang === "en" || lang === "mn") {
    return lang as Lang;
  }
  return "mn";
}
