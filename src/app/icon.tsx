import { ImageResponse } from "next/og";
import {
  getLogoDataUrlForFavicon,
  logoDrawSizeForSquareCanvas,
} from "@/lib/faviconLogo";

export const runtime = "nodejs";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Tab favicon: 512² canvas; logo drawn at true aspect ratio so it scales up vs a square img + contain. */
export default async function Icon() {
  const src = await getLogoDataUrlForFavicon();
  const { width, height } = logoDrawSizeForSquareCanvas(size.width);

  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "transparent",
      }}
    >
      {/* eslint-disable-next-line @next/next/no-img-element -- satori / ImageResponse */}
      <img src={src} alt="" width={width} height={height} />
    </div>,
    { ...size },
  );
}
