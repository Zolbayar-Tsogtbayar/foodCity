import { ImageResponse } from "next/og";
import { getLogoDataUrlForFavicon } from "@/lib/faviconLogo";

export const runtime = "nodejs";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/** Home-screen / Apple touch: same mark, sized for 180×180. */
export default async function AppleIcon() {
  const src = await getLogoDataUrlForFavicon();

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
        <img
          src={src}
          alt=""
          width={156}
          height={156}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
