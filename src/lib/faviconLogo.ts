import { readFile } from "fs/promises";
import { join } from "path";

/** Same aspect as Navbar `Image` (`/fclogo.png`) so favicons maximize the mark in a square. */
const LOGO_W = 180;
const LOGO_H = 180;

/**
 * Pixel size for the logo inside a square `ImageResponse` canvas (wide asset → width-led fit).
 * `insetRatio` is margin on each side as a fraction of canvas (e.g. 0.02 → 96% fill).
 */
export function logoDrawSizeForSquareCanvas(
  canvas: number,
  insetRatio = 0.02,
): { width: number; height: number } {
  const inset = Math.max(2, Math.round(canvas * insetRatio));
  const inner = canvas - 2 * inset;
  const width = inner;
  const height = Math.max(1, Math.round((width * LOGO_H) / LOGO_W));
  return { width, height };
}

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
