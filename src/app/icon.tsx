import { ImageResponse } from "next/og";
import { getLogoDataUrlForFavicon } from "@/lib/faviconLogo";

export const runtime = "nodejs";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Tab favicon: large square canvas so the mark stays readable when the browser scales to 16–32px. */
export default async function Icon() {
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
          background: "#0f172a",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element -- satori / ImageResponse */}
        <img
          src={src}
          alt=""
          width={440}
          height={440}
          style={{ objectFit: "contain" }}
        />
      </div>
    ),
    { ...size },
  );
}
