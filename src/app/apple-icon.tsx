import { ImageResponse } from "next/og";
import { getLogoDataUrlForFavicon, logoDrawSizeForSquareCanvas } from "@/lib/faviconLogo";

export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen / Apple touch: wide logo uses full width of 180² (minus small inset). */
export default async function AppleIcon() {
  const src = await getLogoDataUrlForFavicon();
  const { width, height } = logoDrawSizeForSquareCanvas(size.width);

  return new ImageResponse(
    (
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
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={src} alt="" width={width} height={height} />
      </div>
    ),
    { ...size },
  );
}
