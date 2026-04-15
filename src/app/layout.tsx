import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
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
    <html lang="en" className={`${geist.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
