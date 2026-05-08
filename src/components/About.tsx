"use client";

import { useState, useRef, useEffect } from "react";
import type { AboutSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";
import FormattedText from "./FormattedText";
import { stripHtmlAndDecode } from "@/lib/html-utils";

export default function About({ main }: { main: AboutSections["main"] }) {
  if (main.hidden) return null;
  const rawUrl = main.imageUrl?.trim() || "/images/baclground-image-1.jpg";
  const imageUrl = resolveMediaUrl(rawUrl);
  const isVideo = rawUrl.match(/\.(mp4|webm|mov|ogg|avi)$/i);
  const [muted, setMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  // Try to play with sound first; fall back to muted if browser blocks it
  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = false;
    v.play().then(() => {
      setMuted(false);
    }).catch(() => {
      v.muted = true;
      setMuted(true);
      v.play().catch(() => {});
    });
  }, []);

  function toggleMute() {
    if (!videoRef.current) return;
    const next = !muted;
    videoRef.current.muted = next;
    setMuted(next);
  }

  return (
    <section
      id="about"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image/Video block */}
          <div
            className="hero-reveal relative lg:sticky lg:top-28"
            style={{ animationDelay: "0.1s" }}
          >
            <div className={`relative rounded overflow-hidden mb-8 sm:mb-0 ${isVideo ? "aspect-video" : "aspect-[4/3]"}`}>
              {isVideo ? (
                <>
                  <video
                    ref={videoRef}
                    src={imageUrl}
                    autoPlay
                    muted
                    loop
                    playsInline
                    preload="auto"
                    className="absolute inset-0 w-full h-full object-cover"
                  />
                  <button
                    onClick={toggleMute}
                    className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 hover:bg-black/75 text-white transition-colors"
                    aria-label={muted ? "Дуу нээх" : "Дуу хаах"}
                  >
                    {muted ? (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M16.5 12A4.5 4.5 0 0 0 14 7.97V10l2.45 2.45c.03-.15.05-.3.05-.45zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51A8.796 8.796 0 0 0 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3 3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06A8.99 8.99 0 0 0 17.73 19.73L19.73 21.73 21 20.46 4.27 3zM12 4 9.91 6.09 12 8.18V4z"/>
                      </svg>
                    ) : (
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3A4.5 4.5 0 0 0 14 7.97v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                      </svg>
                    )}
                  </button>
                </>
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-start p-6 sm:p-8">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="relative z-10">
                  <div className="text-white text-lg sm:text-2xl font-black">
                    {main.imageBuildingName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {main.imageBuildingSubtitle}
                  </div>
                </div>
              </div>
            </div>
            <div className="hidden sm:block absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-6 bg-accent-500 text-white rounded px-4 sm:px-6 py-3 sm:py-4 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black">{main.yearsBadgeValue}</div>
              <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                {main.yearsLabel}
              </div>
            </div>
            <div className="sm:hidden bg-accent-500 text-white rounded px-4 py-3 shadow-xl">
              <div className="text-2xl font-black">{main.yearsBadgeValue}</div>
              <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                {main.yearsLabel}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col">
            <span
              className="hero-reveal inline-block text-accent-500 font-semibold text-[10px] sm:text-xs uppercase tracking-[0.2em] mb-4 sm:mb-5"
              style={{ animationDelay: "0.2s" }}
            >
              {stripHtmlAndDecode(main.sectionLabel)}
            </span>
            <h2
              className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 leading-tight mb-5 sm:mb-6 [&_div]:inline [&_p]:inline"
              style={{ animationDelay: "0.35s" }}
            >
              <FormattedText text={main.h2Line1} />{" "}
              <span className="text-accent-500">
                <FormattedText text={main.h2Accent} />
              </span>
            </h2>
            <p
              className="hero-reveal text-gray-500 leading-relaxed mb-5"
              style={{ animationDelay: "0.5s" }}
            >
              <FormattedText text={main.p1} />
            </p>
            <div className="flex-1" />
            <p
              className="hero-reveal text-gray-500 leading-relaxed mb-8 sm:mb-10"
              style={{ animationDelay: "0.6s" }}
            >
              <FormattedText text={main.p2} />
            </p>

            {!main.statsHidden && (main.stats?.length ?? 0) > 0 && (
              <div
                className="hero-reveal grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-100"
                style={{ animationDelay: "0.75s" }}
              >
                {main.stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl sm:text-3xl font-black text-brand-900">
                      {s.value}
                    </div>
                    <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide leading-snug font-normal">
                      {s.label}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
