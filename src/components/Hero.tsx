"use client";

import { useState, useEffect } from "react";
import CountUp from "@/components/CountUp";
import { resolveMediaUrl } from "@/lib/media";
import type { HomeSections } from "@/lib/site-content-types";

export type HeroContent = HomeSections["hero"];

const HOLD = 5000;
const SPEED = 900;

export default function Hero({ hero }: { hero: HeroContent }) {
  const trimmed = (hero.slideImages ?? []).map((s) => s.trim()).filter(Boolean);
  const slidesRaw =
    trimmed.length > 0 ? trimmed : ["/images/baclground-image-1.jpg"];
  const slides = slidesRaw.map((s) => resolveMediaUrl(s));
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const id = setTimeout(() => {
      const next = (current + 1) % slides.length;
      setIncoming(next);
      setEntered(false);
      requestAnimationFrame(() =>
        requestAnimationFrame(() => setEntered(true)),
      );
    }, HOLD);
    return () => clearTimeout(id);
  }, [current]);

  useEffect(() => {
    if (!entered || incoming === null) return;
    const id = setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
      setEntered(false);
    }, SPEED);
    return () => clearTimeout(id);
  }, [entered, incoming]);

  const goTo = (index: number) => {
    if (index === current) return;
    setIncoming(index);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center overflow-hidden"
    >
      {/* Sliding backgrounds */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center will-change-transform"
          style={{
            backgroundImage: `url(${slides[current]})`,
            transform: entered ? "translateX(-100%)" : "translateX(0)",
            transition: entered
              ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)`
              : "none",
          }}
        />
        {incoming !== null && (
          <div
            className="absolute inset-0 bg-cover bg-center will-change-transform"
            style={{
              backgroundImage: `url(${slides[incoming]})`,
              transform: entered ? "translateX(0)" : "translateX(100%)",
              transition: entered
                ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)`
                : "none",
            }}
          />
        )}
      </div>

      {/* Dark overlay */}
      <div className="absolute inset-0 bg-brand-900/65" />
      {/* Accent left strip */}
      <div className="absolute left-0 top-0 bottom-0 w-1 bg-accent-500 z-10" />

      {/* Content */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 pb-20 sm:pt-32 sm:pb-24 lg:py-0 lg:min-h-screen lg:flex lg:items-center">
        <div className="w-full max-w-3xl">
          {/* Badge */}
          <div
            className="hero-reveal inline-flex items-center gap-2 border border-accent-500/40 bg-accent-500/10 rounded px-3 py-1.5 mb-6 sm:mb-8"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="w-1.5 h-1.5 bg-accent-500 rounded-full shrink-0" />
            <span className="text-accent-400 text-xs font-semibold uppercase tracking-widest">
              {hero.badge}
            </span>
          </div>

          <h1
            className="hero-reveal text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-white leading-tight mb-5 sm:mb-6"
            style={{ animationDelay: "0.25s" }}
          >
            {hero.titleLine1}{" "}
            <span className="text-accent-500">{hero.titleAccent}</span>
            <br />
            {hero.titleLine2}
          </h1>

          <p
            className="hero-reveal text-gray-300 text-base sm:text-lg lg:text-xl leading-relaxed mb-8 sm:mb-10 max-w-2xl"
            style={{ animationDelay: "0.45s" }}
          >
            {hero.desc}
          </p>

          <div
            className="hero-reveal flex flex-col xs:flex-row gap-3 sm:gap-4 mb-12 sm:mb-16 sm:w-1/2"
            style={{ animationDelay: "0.6s" }}
          >
            <a
              href="/properties"
              className="inline-flex items-center justify-center gap-2 bg-accent-500 hover:bg-accent-600 text-white font-bold px-6 sm:px-8 py-3.5 sm:py-4 rounded transition-all duration-200 text-sm sm:text-base"
            >
              {hero.btn1}
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M17 8l4 4m0 0l-4 4m4-4H3"
                />
              </svg>
            </a>
            <a
              href="/contact"
              className="inline-flex items-center justify-center gap-2 border border-gray-500 hover:border-accent-500 text-gray-300 hover:text-accent-500 font-semibold px-6 sm:px-8 py-3.5 sm:py-4 rounded transition-all duration-200 text-sm sm:text-base"
            >
              {hero.btn2}
            </a>
          </div>

          {/* Stats */}
          <div
            className="hero-reveal grid grid-cols-2 sm:grid-cols-4 gap-6 sm:gap-8 pt-6 sm:pt-8 border-t border-white/20"
            style={{ animationDelay: "0.75s" }}
          >
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <CountUp
                  value={stat.value}
                  className="text-2xl sm:text-3xl font-black text-accent-500"
                />
                <div className="text-gray-400 text-xs sm:text-sm mt-1 uppercase tracking-wide">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide dots */}
      <div className="absolute bottom-6 sm:bottom-10 left-1/2 -translate-x-1/2 flex items-center gap-3 z-20">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`${hero.slideLabel} ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === (incoming ?? current)
                ? "w-8 h-2 bg-accent-500"
                : "w-2 h-2 bg-white/40 hover:bg-white/70"
            }`}
          />
        ))}
      </div>
    </section>
  );
}
