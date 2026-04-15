"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const navLinks = [
  { label: "Нүүр", href: "/" },
  { label: "Бидний тухай", href: "/about" },
  { label: "Үйл ажиллагаа", href: "/services" },
  { label: "Хамтран ажиллах", href: "/properties" },
  { label: "Мэдээ мэдээлэл", href: "/team" },
  { label: "Холбоо барих", href: "/contact" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const pathname = usePathname();

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

  // Close mobile menu on route change
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? "bg-brand-900 shadow-xl" : "bg-brand-900/85 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 flex items-center justify-between h-16 sm:h-20">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="w-8 h-8 sm:w-9 sm:h-9 bg-accent-500 rounded flex items-center justify-center">
            <svg
              viewBox="0 0 24 24"
              fill="white"
              className="w-4 h-4 sm:w-5 sm:h-5"
            >
              <path d="M3 10.5L12 3l9 7.5V21H3V10.5z" />
              <rect
                x="9"
                y="14"
                width="6"
                height="7"
                fill="white"
                opacity="0.8"
              />
            </svg>
          </div>
          <span className="text-white font-bold text-lg sm:text-xl tracking-wide">
            Food<span className="text-accent-500">City</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-6 xl:gap-8">
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

        {/* Mobile: phone icon + hamburger */}
        <div className="flex items-center gap-3 lg:hidden">
          <a
            href="tel:+97611000000"
            className="text-accent-500"
            aria-label="Утас"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" />
            </svg>
          </a>
          <button
            className="text-white p-1"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Цэс нээх"
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

      {/* Mobile / Tablet Menu */}
      <div
        className={`lg:hidden overflow-hidden transition-all duration-300 ease-in-out ${
          menuOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-brand-900 border-t border-brand-700 px-4 sm:px-6 pb-4">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center py-3.5 text-sm font-medium border-b border-brand-800 last:border-0 transition-colors ${
                  isActive
                    ? "text-accent-500"
                    : "text-gray-300 hover:text-accent-500"
                }`}
              >
                <span className={`w-1.5 h-1.5 rounded-full mr-3 shrink-0 ${isActive ? "bg-accent-500" : "bg-accent-500/50"}`} />
                {link.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
