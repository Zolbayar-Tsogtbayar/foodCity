"use client";
import Image from "next/image";
import Link from "next/link";
import { resolveMediaUrl } from "@/lib/media";
import type { FooterSections, FooterSocial } from "@/lib/site-content-types";
import { Translations } from "@/lib/translations";
import FormattedText from "./FormattedText";
import { useLanguage } from "@/contexts/LanguageContext";

const getSocialIcon = (type: FooterSocial["iconType"]) => {
  switch (type) {
    case "facebook":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
        </svg>
      );
    case "instagram":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
        </svg>
      );
    case "linkedin":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
        </svg>
      );
    case "twitter":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.84 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
        </svg>
      );
    case "youtube":
      return (
        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
          <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
        </svg>
      );
    default:
      return null;
  }
};

export default function Footer({ 
  content, 
  t,
  hiddenPageIds = []
}: { 
  content: FooterSections; 
  t: Translations;
  hiddenPageIds?: string[];
}) {
  const { lang } = useLanguage();
  const { partnersLabel, items: partners } = content.partners;
  const marqueePartners = [...(partners || []), ...(partners || [])];
  const year = new Date().getFullYear();

  const allLinks = [
    { id: "home", label: t.nav.home, href: "/" },
    { id: "about", label: t.nav.about, href: "/about" },
    { id: "gallery", label: t.nav.gallery, href: "/gallery" },
    { id: "projects-page", label: t.nav.projects, href: "/projects" },
    { id: "properties-page", label: t.nav.properties, href: "/properties" },
    { id: "contact", label: t.nav.contact, href: "/contact" },
  ];

  const navLinks = allLinks.filter(link => !hiddenPageIds.includes(link.id));
  
  return (
    <footer className="bg-brand-900 text-white">
      {/* Partners */}
      {partners && partners.length > 0 && !content.partners?.hidden && (
        <div className="border-b border-brand-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
            <p className="text-center text-gray-500 text-xs uppercase tracking-[0.16em] mb-4 sm:mb-6">
              {partnersLabel}
            </p>
            <div className="relative overflow-hidden rounded-2xl border border-brand-800/90 bg-brand-950/35 py-2">
              <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-14 bg-linear-to-r from-brand-900 to-transparent sm:w-20" />
              <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-14 bg-linear-to-l from-brand-900 to-transparent sm:w-20" />

              <div className="partner-marquee flex w-max items-center gap-3 sm:gap-4">
                {marqueePartners.map((p, i) => (
                  <div
                    key={`${p.name}-${i}`}
                    className="group flex h-14 min-w-[8.5rem] items-center justify-center rounded-xl border border-brand-800/70 bg-brand-900/45 px-4 sm:min-w-[10.5rem]"
                  >
                    <Image
                      src={resolveMediaUrl(p.src)}
                      alt={p.name}
                      width={Math.max(p.width, 1)}
                      height={Math.max(p.height, 1)}
                      className="h-auto max-h-9 w-auto max-w-full object-contain object-center sm:max-h-10"
                      sizes="(max-width: 640px) 140px, 180px"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-5">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">
          {/* Left Side: Brand, Copyright, Socials */}
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            {!content.brand?.hidden && !content.logoHidden && (
              <Link href="/" className="inline-block shrink-0">
                <Image
                  src={resolveMediaUrl(content.logo || "/fclogo.png")}
                  alt="Food City"
                  width={160}
                  height={57}
                  className="h-[2.5rem] w-auto object-contain"
                  unoptimized
                />
              </Link>
            )}
            <div className="hidden sm:block w-px h-6 bg-brand-800"></div>
            {!content.copyrightHidden && (
              <p className="text-gray-500 text-[11px] leading-relaxed text-center sm:text-left">
                {content.copyright}
              </p>
            )}
          </div>

          {/* Right Side: Links & Socials Inline */}
          <div className="flex flex-wrap items-center justify-center md:justify-end gap-x-6 gap-y-3">
            {/* Auto Sync Nav Links */}
            {navLinks.map((link) => (
              <Link
                key={link.id}
                href={link.href}
                className="text-gray-400 hover:text-accent-400 text-[13px] font-medium transition-colors"
              >
                {link.label}
              </Link>
            ))}

            {/* Additional Links */}
            {(content.sections || []).filter(s => !s.hidden).flatMap(section => 
              (section.items || []).filter(item => !item.hidden).map((link, lidx) => (
                <Link
                  key={`${section.label}-${lidx}`}
                  href={link.href || "#"}
                  className="text-gray-400 hover:text-accent-400 text-[13px] font-medium transition-colors"
                >
                  {link.label}
                </Link>
              ))
            )}

            <div className="hidden sm:block w-px h-4 bg-brand-800 mx-2"></div>

            {/* Socials */}
            <div className="flex gap-3">
              {(content.socials || []).filter(s => !s.hidden).map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  aria-label={s.label}
                  {...(s.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                  className="text-gray-500 hover:text-accent-400 transition-colors duration-200"
                >
                  {getSocialIcon(s.iconType)}
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

