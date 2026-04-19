import { readFile } from "fs/promises";
import { join } from "path";

/** PNG as data URL for OG/ImageResponse favicon generation (fills square canvas). */
export async function getLogoDataUrlForFavicon(): Promise<string> {
  try {
    const buf = await readFile(join(process.cwd(), "public", "fclogo.png"));
    return `data:image/png;base64,${buf.toString("base64")}`;
  } catch {
    return (
      "data:image/svg+xml," +
      encodeURIComponent(
        `<svg xmlns="http://www.w3.org/2000/svg" width="512" height="512" viewBox="0 0 512 512"><text x="256" y="300" text-anchor="middle" font-size="200" font-weight="bold" fill="#f97316" font-family="system-ui,sans-serif">FC</text></svg>`,
      )
    );
  }
}
