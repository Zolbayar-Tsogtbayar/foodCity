import type { Metadata } from "next";
import { Roboto } from "next/font/google";
import "./globals.css";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["300", "400", "500", "700", "900"],
});

export const metadata: Metadata = {
  title: "FoodCity — Барилга & Оффис Түрээс",
  description:
    "FoodCity нь premium арилжааны орон зай болон оффис барьж, түрээслүүлдэг. Орчин үеийн барилга, ухаалаг дизайн, бизнест зориулсан уян хатан түрээсийн нөхцөл.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="mn" className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
