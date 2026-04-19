import { revalidateTag } from "next/cache";
import { NextResponse } from "next/server";

/** Invalidates cached `fetch` calls tagged `site-content` (see getSiteContent.ts). */
export async function POST(req: Request) {
  const secret = req.headers.get("x-revalidate-secret");
  if (!secret || secret !== process.env.REVALIDATE_SECRET) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  revalidateTag("site-content", "default");
  return NextResponse.json({ ok: true });
}
