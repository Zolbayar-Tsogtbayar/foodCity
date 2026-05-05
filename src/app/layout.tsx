import type { Metadata } from "next";
import { Suspense } from "react";
import { Roboto } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import NavbarWithContent from "@/components/NavbarWithContent";
import FooterWithContent from "@/components/FooterWithContent";
import Navbar from "@/components/Navbar";
import PageWrapper from "@/components/PageWrapper";
import ChatBotLoader from "@/components/ChatBotLoader";
import TopLoader from "@/components/TopLoader";

import { getLanguageServer } from "@/lib/i18n-server";

const roboto = Roboto({
  variable: "--font-roboto",
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "BukhBat — Барилга & Оффис Түрээс",
  description:
    "BukhBat нь premium арилжааны орон зай болон оффис барьж, түрээслүүлдэг. Орчин үеийн барилга, ухаалаг дизайн, бизнест зориулсан уян хатан түрээсийн нөхцөл.",
};

function FooterFallback() {
  return (
    <footer
      className="min-h-[12rem] border-t border-brand-800 bg-brand-900"
      aria-hidden
    />
  );
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const lang = await getLanguageServer();
  return (
    <html lang={lang} className={`${roboto.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col">
        <Providers>
          <TopLoader />
          <Navbar />
          <PageWrapper>

            <main className="flex-1">{children}</main>
          </PageWrapper>
          <Suspense fallback={<FooterFallback />}>
            <FooterWithContent />
          </Suspense>
          <ChatBotLoader />
        </Providers>
      </body>
    </html>
  );
}
