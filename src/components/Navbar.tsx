"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLanguage } from "@/contexts/LanguageContext";

export default function Navbar({ 
  hiddenPageIds = [] 
}: { 
  hiddenPageIds?: string[] 
}) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();
  const { lang, t, toggle } = useLanguage();

  const allLinks = [
    { id: "home", label: t.nav.home, href: "/" },
    { id: "about", label: t.nav.about, href: "/about" },
    { id: "gallery", label: t.nav.gallery, href: "/gallery" },
    { id: "projects-page", label: t.nav.projects, href: "/projects" },
    { id: "properties-page", label: t.nav.properties, href: "/properties" },
    { id: "contact", label: t.nav.contact, href: "/contact" },
  ];

  const navLinks = allLinks.filter(link => !hiddenPageIds.includes(link.id));


  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onResize = () => {
      if (window.innerWidth >= 1024) setMenuOpen(false);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] isolate transition-all duration-300 ${
        scrolled ? "bg-brand-900 shadow-xl" : "bg-brand-900/85 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 min-h-[4.25rem] sm:min-h-[5.25rem] py-2 sm:py-2.5">
        {/* Logo */}
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center lg:flex-initial lg:shrink-0"
        >
          <span className="inline-flex shrink-0 items-center">
            <Image
              src="/fclogo.png"
              alt="Food City"
              width={320}
              height={114}
              className="h-12 w-auto object-contain object-left sm:h-14 lg:h-16 brightness-150"
              priority
              unoptimized
            />
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
                  isActive
                    ? "text-accent-500"
                    : "text-gray-300 hover:text-accent-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Phone + lang toggle — desktop only */}
        <div className="hidden lg:flex items-center gap-4 xl:gap-6 shrink-0">
          <a
            href="tel:+97611000000"
            className="flex items-center gap-2 text-gray-300 hover:text-white text-sm transition-colors whitespace-nowrap"
          >
            <svg
              className="w-4 h-4 text-accent-500 shrink-0"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" />
            </svg>
            +976 1100-0000
          </a>
          <button
            onClick={toggle}
            className="text-xs xl:text-sm font-bold uppercase tracking-wider text-gray-300 hover:text-white transition-colors"
          >
            {lang === "mn" ? "EN" : "MN"}
          </button>
        </div>

        {/* Mobile controls */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
          <button
            onClick={toggle}
            className="flex h-11 w-11 shrink-0 items-center justify-center text-sm font-bold text-gray-300 hover:text-white"
          >
            {lang === "mn" ? "EN" : "MN"}
          </button>
          <a
            href="tel:+97611000000"
            className="flex h-11 w-11 shrink-0 items-center justify-center text-accent-500 touch-manipulation"
            aria-label="Утас"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" />
            </svg>
          </a>
          <button
            type="button"
            className="flex h-11 w-11 shrink-0 items-center justify-center rounded-md text-white touch-manipulation [-webkit-tap-highlight-color:transparent]"
            onClick={() => setMenuOpen((o) => !o)}
            aria-expanded={menuOpen}
            aria-label={menuOpen ? t.nav.closeMenu : t.nav.openMenu}
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {menuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-[min(100vh,100dvh)] overflow-y-auto overflow-x-hidden opacity-100 pointer-events-auto"
            : "max-h-0 overflow-hidden opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-brand-900 border-t border-brand-700 px-4 sm:px-6 pb-4">
          {navLinks.map((link, i) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className={`flex items-center py-3.5 text-sm font-medium transition-colors ${
                  i < navLinks.length - 1 ? "border-b border-brand-800" : ""
                } ${isActive ? "text-accent-500" : "text-gray-300 hover:text-accent-500"}`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isActive ? "bg-accent-500" : "bg-accent-500/50"}`}
                />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
