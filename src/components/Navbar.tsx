"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const mainNavLinks = [{ label: "Нүүр", href: "/" }];

/** Shown under “Зар мэдээ” */
const zarmedeeLinks = [
  { label: "Захиалга", href: "/order" },
  { label: "Борлуулалтын зар", href: "/sales" },
  { label: "Ажлын зар", href: "/jobs" },
  { label: "Мэдээ мэдээлэл", href: "/team" },
];

const restNavLinks = [
  { label: "Бидний тухай", href: "/about" },
  { label: "Үйл ажиллагаа", href: "/services" },
  { label: "Хамтран ажиллах", href: "/properties" },
  { label: "Холбоо барих", href: "/contact" },
];

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      width="14"
      height="14"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [zarmedeeOpen, setZarmedeeOpen] = useState(false);
  /** Desktop “Зар мэдээ” — CSS-only hover stayed open after client navigation while cursor remained over the bar */
  const [desktopZarmedeeOpen, setDesktopZarmedeeOpen] = useState(false);
  const pathname = usePathname();

  const isZarmedeeActive = zarmedeeLinks.some((l) => l.href === pathname);

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
    setZarmedeeOpen(false);
    setDesktopZarmedeeOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!menuOpen) setZarmedeeOpen(false);
  }, [menuOpen]);

  useEffect(() => {
    if (menuOpen && isZarmedeeActive) setZarmedeeOpen(true);
  }, [menuOpen, isZarmedeeActive]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-[200] isolate transition-all duration-300 ${
        scrolled ? "bg-brand-900 shadow-xl" : "bg-brand-900/85 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between gap-3 min-h-[4.25rem] sm:min-h-[5.25rem] py-2 sm:py-2.5">
        {/* Logo — min-w-0 so it never squeezes the mobile controls off-screen */}
        <Link
          href="/"
          className="flex min-w-0 flex-1 items-center lg:flex-initial lg:shrink-0"
        >
          <Image
            src="/fclogo.png"
            alt="Food City"
            width={320}
            height={114}
            className="h-11 w-auto max-w-[200px] object-contain object-left sm:h-12 sm:max-w-[240px] lg:h-14 lg:max-w-[280px]"
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-5 xl:gap-7">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-accent-500" : "text-gray-300 hover:text-accent-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}

          {/* Controlled dropdown so it closes after navigation (hover-only stayed open with client-side routing) */}
          <div
            className="relative"
            onMouseEnter={() => setDesktopZarmedeeOpen(true)}
            onMouseLeave={() => setDesktopZarmedeeOpen(false)}
          >
            <button
              type="button"
              className={`flex items-center gap-1 text-xs xl:text-sm font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
                isZarmedeeActive || desktopZarmedeeOpen
                  ? "text-accent-500"
                  : "text-gray-300 hover:text-accent-500"
              }`}
              aria-haspopup="menu"
              aria-expanded={desktopZarmedeeOpen}
            >
              Зар мэдээ
              <ChevronDown
                className={`opacity-80 transition-transform ${desktopZarmedeeOpen ? "translate-y-px" : ""}`}
              />
            </button>
            <div
              className={`absolute left-0 top-full z-[100] -mt-2 min-w-[220px] pt-2 transition-opacity duration-150 ${
                desktopZarmedeeOpen
                  ? "pointer-events-auto visible opacity-100"
                  : "pointer-events-none invisible opacity-0"
              }`}
              role="menu"
              aria-label="Зар мэдээ"
              aria-hidden={!desktopZarmedeeOpen}
            >
              <div className="rounded-lg border border-brand-700 bg-brand-800/95 py-2 shadow-xl backdrop-blur-sm">
                {zarmedeeLinks.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      role="menuitem"
                      onClick={() => setDesktopZarmedeeOpen(false)}
                      className={`block px-4 py-2.5 text-sm font-medium tracking-wide transition-colors ${
                        active
                          ? "bg-brand-900/80 text-accent-500"
                          : "text-gray-200 hover:bg-brand-900/60 hover:text-accent-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

          {restNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`text-xs xl:text-sm font-medium uppercase tracking-wider transition-colors duration-200 whitespace-nowrap ${
                  isActive ? "text-accent-500" : "text-gray-300 hover:text-accent-500"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* Phone — desktop only */}
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
        </div>

        {/* Mobile: phone icon + hamburger — shrink-0 keeps tap targets reachable */}
        <div className="flex shrink-0 items-center gap-2 sm:gap-3 lg:hidden">
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
            aria-label={menuOpen ? "Цэс хаах" : "Цэс нээх"}
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

      {/* Mobile / Tablet Menu — closed: pointer-events-none so nothing blocks the bar */}
      <div
        className={`lg:hidden transition-all duration-300 ease-in-out ${
          menuOpen
            ? "max-h-[min(100vh,100dvh)] overflow-y-auto overflow-x-hidden opacity-100 pointer-events-auto"
            : "max-h-0 overflow-hidden opacity-0 pointer-events-none"
        }`}
      >
        <div className="bg-brand-900 border-t border-brand-700 px-4 sm:px-6 pb-4">
          {mainNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMenuOpen(false);
                  setZarmedeeOpen(false);
                }}
                className={`flex items-center py-3.5 text-sm font-medium border-b border-brand-800 transition-colors ${
                  isActive ? "text-accent-500" : "text-gray-300 hover:text-accent-500"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isActive ? "bg-accent-500" : "bg-accent-500/50"}`}
                />
                {link.label}
              </Link>
            );
          })}

          <div className="border-b border-brand-800">
            <button
              type="button"
              className={`flex w-full items-center justify-between py-3.5 text-sm font-medium text-left transition-colors ${
                isZarmedeeActive ? "text-accent-500" : "text-gray-300"
              }`}
              onClick={() => setZarmedeeOpen(!zarmedeeOpen)}
              aria-expanded={zarmedeeOpen}
            >
              <span className="flex items-center">
                <span
                  className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isZarmedeeActive ? "bg-accent-500" : "bg-accent-500/50"}`}
                />
                Зар мэдээ
              </span>
              <ChevronDown
                className={`shrink-0 transition-transform ${zarmedeeOpen ? "rotate-180" : ""}`}
              />
            </button>
            {zarmedeeOpen && (
              <div className="pb-2 pl-2">
                {zarmedeeLinks.map((item) => {
                  const active = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => {
                        setMenuOpen(false);
                        setZarmedeeOpen(false);
                      }}
                      className={`flex items-center py-2.5 pl-6 text-sm border-l-2 border-brand-700 transition-colors ${
                        active
                          ? "border-accent-500 text-accent-500"
                          : "border-transparent text-gray-400 hover:text-accent-400"
                      }`}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {restNavLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => {
                  setMenuOpen(false);
                  setZarmedeeOpen(false);
                }}
                className={`flex items-center py-3.5 text-sm font-medium border-b border-brand-800 last:border-0 transition-colors ${
                  isActive ? "text-accent-500" : "text-gray-300 hover:text-accent-500"
                }`}
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
