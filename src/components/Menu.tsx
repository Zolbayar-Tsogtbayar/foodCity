"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import type { PropertiesPageSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";
import FormattedText from "./FormattedText";

const SPEED = 500;
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isVideo(src: string) { return VIDEO_EXTS.test(src); }

type PropertyItem = PropertiesPageSections["items"][number];

function MediaSlide({
  src,
  alt,
  active,
  onVideoPlay,
  onVideoPause,
}: {
  src: string;
  alt: string;
  active: boolean;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (!videoRef.current) return;
    if (active) {
      void videoRef.current.play().catch(() => undefined);
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [active]);

  if (isVideo(src)) {
    return (
      <video
        ref={videoRef}
        src={resolveMediaUrl(src)}
        className="h-full w-full object-cover"
        playsInline
        onPlay={onVideoPlay}
        onPause={onVideoPause}
        onEnded={onVideoPause}
      />
    );
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={resolveMediaUrl(src)} alt={alt} className="absolute inset-0 h-full w-full object-cover" />
  );
}

function Modal({ item, onClose }: { item: PropertyItem; onClose: () => void }) {
  const images = item.images.length > 0 ? item.images : (item.image ? [item.image] : []);
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [visible, setVisible] = useState(false);
  const thumbsRef = useRef<HTMLDivElement>(null);

  useEffect(() => { requestAnimationFrame(() => setVisible(true)); }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 300);
  }

  const goTo = (next: number, direction: "left" | "right") => {
    if (next === current || incoming !== null) return;
    setDir(direction);
    setIncoming(next);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  const prev = () => goTo((current - 1 + images.length) % images.length, "right");
  const next = () => goTo((current + 1) % images.length, "left");

  useEffect(() => {
    if (!entered || incoming === null) return;
    const id = setTimeout(() => { setCurrent(incoming); setIncoming(null); setEntered(false); }, SPEED);
    return () => clearTimeout(id);
  }, [entered, incoming]);

  useEffect(() => {
    const el = thumbsRef.current?.children[current] as HTMLElement | undefined;
    el?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [current]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && !videoPlaying) prev();
      if (e.key === "ArrowRight" && !videoPlaying) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, incoming, videoPlaying]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (images.length <= 1 || incoming !== null || videoPlaying) return;
    const id = setTimeout(() => next(), 3000);
    return () => clearTimeout(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current, incoming, videoPlaying, images.length]);

  const displayIndex = incoming !== null ? incoming : current;

  const slides = (
    <>
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: entered ? (dir === "left" ? "translateX(-100%)" : "translateX(100%)") : "translateX(0)",
          transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
        }}
      >
        <MediaSlide src={images[current]} alt={`${item.name} ${current + 1}`} active={incoming === null}
          onVideoPlay={() => setVideoPlaying(true)} onVideoPause={() => setVideoPlaying(false)} />
      </div>
      {incoming !== null && (
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: entered ? "translateX(0)" : (dir === "left" ? "translateX(100%)" : "translateX(-100%)"),
            transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
          }}
        >
          <MediaSlide src={images[incoming]} alt={`${item.name} ${incoming + 1}`} active={false} />
        </div>
      )}
    </>
  );

  const arrows = images.length > 1 && (
    <>
      <button onClick={(e) => { e.stopPropagation(); prev(); }}
        className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 sm:bg-white/10 sm:hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      <button onClick={(e) => { e.stopPropagation(); next(); }}
        className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-black/30 hover:bg-black/50 sm:bg-white/10 sm:hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </>
  );

  const closeBtn = (extraClass = "") => (
    <button onClick={handleClose}
      className={`flex h-10 w-10 items-center justify-center rounded-full text-white backdrop-blur-sm transition-colors ${extraClass}`}>
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  );

  return createPortal(
    <>
      {/* ── MOBILE: centered card overlay ── hidden on sm+ ── */}
      <div
        className={`fixed inset-0 z-[500] sm:hidden transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      >
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
        <div
          className={`absolute left-1/2 top-1/2 z-10 w-[calc(100%-2rem)] max-w-lg -translate-x-1/2 -translate-y-1/2 bg-white rounded-2xl overflow-hidden shadow-2xl transition-all duration-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="absolute top-2 right-2 z-20">
            {closeBtn("bg-black/25 hover:bg-black/45")}
          </div>
          {images.length > 0 && (
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              {slides}
              {arrows}
              {images.length > 1 && (
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-1.5">
                  {images.map((_, i) => (
                    <button key={i} onClick={() => goTo(i, i > current ? "left" : "right")}
                      className={`rounded-full transition-all duration-300 ${i === displayIndex ? "w-5 h-1.5 bg-accent-500" : "w-1.5 h-1.5 bg-white/60"}`} />
                  ))}
                </div>
              )}
            </div>
          )}
          <div className="p-4">
            <div className="flex items-start justify-between gap-2 mb-1">
              <h2 className="text-lg font-bold text-brand-900">
                <FormattedText text={item.name} />
              </h2>
              {item.badge && (
                <span className="shrink-0 rounded bg-accent-500 px-2 py-0.5 text-xs font-bold text-white">{item.badge}</span>
              )}
            </div>
            {item.description && (
              <p className="text-gray-500 text-sm leading-relaxed mb-3">
                <FormattedText text={item.description} />
              </p>
            )}
            <div className="grid grid-cols-3 gap-2 py-3 border-y border-gray-100">
              {[
                { icon: "▭", label: item.size },
                { icon: "≡", label: item.floor },
                { icon: "⊡", label: item.parking },
              ].map((spec) => (
                <div key={spec.label} className="text-center">
                  <div className="text-accent-500 text-xs mb-0.5">{spec.icon}</div>
                  <div className="text-gray-600 text-xs font-medium leading-tight">{spec.label}</div>
                </div>
              ))}
            </div>
            <div className="flex items-center justify-between gap-2 mt-3">
              <div>
                <div className="text-xs text-gray-400 uppercase tracking-wide">Эхлэх үнэ</div>
                <div className="text-accent-500 font-black text-base leading-tight">{item.price}</div>
              </div>
              <a href="/contact"
                className="shrink-0 bg-brand-900 hover:bg-accent-500 text-white text-xs font-semibold px-4 py-2 rounded transition-colors duration-200">
                Лавлагаа авах
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* ── DESKTOP: full-screen lightbox ── hidden below sm ── */}
      <div
        className={`fixed inset-0 z-[500] hidden sm:flex flex-col bg-black transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      >
        <div className="absolute top-4 right-4 z-30">
          {closeBtn("bg-white/10 hover:bg-white/25")}
        </div>
        <div className={`relative flex-1 overflow-hidden transition-transform duration-300 ${visible ? "scale-100" : "scale-[0.97]"}`}>
          {images.length > 0 ? (
            <>
              {slides}
              {arrows}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-8 pb-6 pt-24">
                <p className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/50">
                  {displayIndex + 1} / {images.length}
                  {isVideo(images[displayIndex]) && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Video
                    </span>
                  )}
                </p>
                <div className="flex items-center gap-3 mb-1">
                  <h2 className="text-3xl font-bold text-white leading-tight">
                    <FormattedText text={item.name} />
                  </h2>
                  {item.badge && (
                    <span className="rounded bg-accent-500 px-2.5 py-1 text-xs font-bold text-white">{item.badge}</span>
                  )}
                </div>
                {item.description && (
                  <p className="mt-1 text-base text-white/65 leading-relaxed">
                    <FormattedText text={item.description} />
                  </p>
                )}
                <div className="mt-3 flex items-center gap-6">
                  <span className="text-white/60 text-sm">{item.size}</span>
                  <span className="text-white/60 text-sm">{item.floor}</span>
                  <span className="text-white/60 text-sm">{item.parking}</span>
                  <span className="text-accent-400 font-bold text-base">{item.price}</span>
                </div>
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-8">
                <h2 className="text-3xl font-bold text-white mb-2">{item.name}</h2>
                {item.description && <p className="text-white/60 text-base">{item.description}</p>}
              </div>
            </div>
          )}
        </div>
        {images.length > 1 && (
          <div className="shrink-0 bg-black/90 px-5 py-3" onClick={(e) => e.stopPropagation()}>
            <div ref={thumbsRef} className="flex gap-2 overflow-x-auto" style={{ scrollbarWidth: "none" }}>
              {images.map((src, i) => (
                <button key={i} onClick={() => goTo(i, i > current ? "left" : "right")}
                  className={`relative shrink-0 h-16 w-24 rounded-lg overflow-hidden transition-all duration-200 ${i === displayIndex ? "ring-2 ring-accent-500 opacity-100" : "opacity-35 hover:opacity-65"}`}>
                  {isVideo(src) ? (
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
                      <svg className="w-5 h-5 text-white/80" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                    </div>
                  ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={resolveMediaUrl(src)} alt="" className="absolute inset-0 h-full w-full object-cover" />
                  )}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </>,
    document.body
  );
}

export default function Properties({
  content,
}: {
  content: PropertiesPageSections;
}) {
  const allLabel = "Бүгд";
  const displayCategories = [allLabel, ...content.categories.filter(c => c !== allLabel)];

  const [active, setActive] = useState(allLabel);
  const [page, setPage] = useState(0);
  const [selected, setSelected] = useState<PropertyItem | null>(null);

  const filtered =
    active === allLabel
      ? content.items
      : content.items.filter(
          (p) =>
            (p.category || "").trim().toLowerCase() ===
            active.trim().toLowerCase(),
        );




  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  const hasGallery = (p: PropertyItem) => p.image || p.images.length > 0;

  return (
    <section id="properties" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span
            className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            {content.header.badge}
          </span>
          <h2
            className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4"
            style={{ animationDelay: "0.25s" }}
          >
            {content.header.titleLine1}{" "}
            <span className="text-accent-500">
              {content.header.titleAccent}
            </span>
          </h2>
          <p
            className="hero-reveal text-gray-500 text-base sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            {content.header.intro}
          </p>
        </div>

        {/* Filters */}
        <div
          className="hero-reveal flex gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center"
          style={{ animationDelay: "0.5s" }}
        >
          {displayCategories.map((cat) => (

            <button
              key={cat}
              onClick={() => {
                setActive(cat);
                setPage(0);
              }}
              className={`px-4 sm:px-5 py-2 rounded text-xs sm:text-sm font-semibold uppercase tracking-wide transition-all whitespace-nowrap shrink-0 ${
                active === cat
                  ? "bg-brand-900 text-white"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        <div
          className="hero-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 min-h-[200px]"
          style={{ animationDelay: "0.6s" }}
        >
          {paged.length > 0 ? (
            paged.map((p) => {
              const clickable = hasGallery(p);
              const Tag = clickable ? "button" : "div";
              return (
                <Tag
                  key={p.id}
                  {...(clickable ? { onClick: () => setSelected(p) } : {})}
                  className={`group bg-white border border-gray-100 hover:border-accent-200 rounded overflow-hidden hover:shadow-2xl transition-all duration-300 text-left w-full ${clickable ? "cursor-pointer" : ""}`}
                >
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 sm:h-48">
                    {p.image ? (
                      isVideo(p.image) ? (
                        <video
                          src={resolveMediaUrl(p.image)}
                          autoPlay
                          loop
                          muted
                          playsInline
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={resolveMediaUrl(p.image)}
                          alt={p.name}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )
                    ) : (
                      <>
                        <div
                          className="absolute inset-0 opacity-10"
                          style={{
                            backgroundImage:
                              "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                            backgroundSize: "24px 24px",
                          }}
                        />
                        <svg
                          viewBox="0 0 120 80"
                          className="absolute bottom-0 right-4 w-20 opacity-20 sm:w-24"
                          fill="white"
                        >
                          <rect x="10" y="20" width="30" height="60" />
                          <rect x="50" y="5" width="40" height="75" />
                          <rect x="100" y="35" width="20" height="45" />
                          {[0, 1, 2].map((r) =>
                            [15, 25, 35].map((x) => (
                              <rect
                                key={`${r}${x}`}
                                x={x}
                                y={28 + r * 18}
                                width="6"
                                height="10"
                                fill="#f97316"
                                opacity="0.8"
                              />
                            )),
                          )}
                        </svg>
                      </>
                    )}
                    {p.badge && (
                      <span className="absolute left-3 top-3 rounded bg-accent-500 px-2.5 py-1 text-xs font-bold text-white">
                        {p.badge}
                      </span>
                    )}
                    <span className="absolute bottom-3 right-3 z-10 rounded bg-black/35 px-3 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-sm">
                      {p.tag}
                    </span>
                    {p.images.length > 1 && (
                      <span className="absolute bottom-3 left-3 z-10 rounded bg-black/35 px-2 py-0.5 text-xs text-white/80 backdrop-blur-sm">
                        {p.images.length} медиа
                      </span>
                    )}
                  </div>

                  <div className="p-4 sm:p-6">
                    <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-1 group-hover:text-accent-500 transition-colors">
                      <FormattedText text={p.name} />
                    </h3>
                    <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                      <FormattedText text={p.description} />
                    </p>

                    <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-5 py-3 sm:py-4 border-y border-gray-100">
                      {[
                        { icon: "▭", label: p.size },
                        { icon: "≡", label: p.floor },
                        { icon: "⊡", label: p.parking },
                      ].map((spec) => (
                        <div key={spec.label} className="text-center">
                          <div className="text-accent-500 text-xs mb-0.5">
                            {spec.icon}
                          </div>
                          <div className="text-gray-600 text-xs font-medium leading-tight">
                            {spec.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex items-center justify-between gap-2">
                      <div>
                        <div className="text-xs text-gray-400 uppercase tracking-wide">
                          Эхлэх үнэ
                        </div>
                        <div className="text-accent-500 font-black text-base sm:text-lg leading-tight">
                          {p.price}
                        </div>
                      </div>
                      <a
                        href="/contact"
                        onClick={(e) => e.stopPropagation()}
                        className="shrink-0 bg-brand-900 hover:bg-accent-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded transition-colors duration-200"
                      >
                        Лавлагаа авах
                      </a>
                    </div>
                  </div>
                </Tag>
              );
            })
          ) : (
            <div className="col-span-full py-20 text-center">
              <div className="text-gray-300 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <p className="text-gray-500 font-medium">Энэ ангилалд одоогоор мэдээлэл байхгүй байна.</p>
              <button 
                onClick={() => setActive(allLabel)}
                className="mt-4 text-accent-500 font-bold hover:underline"
              >
                Бүх ангилал руу буцах
              </button>
            </div>
          )}
        </div>


        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-10">
            <button
              onClick={() => setPage((p) => p - 1)}
              disabled={page === 0}
              className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              ←
            </button>
            {Array.from({ length: totalPages }, (_, i) => (
              <button
                key={i}
                onClick={() => setPage(i)}
                className={`w-8 h-8 rounded text-sm font-bold transition-colors ${
                  i === page
                    ? "bg-brand-900 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-gray-400 hover:text-brand-900"
                }`}
              >
                {i + 1}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => p + 1)}
              disabled={page === totalPages - 1}
              className="px-3 py-1.5 rounded border border-gray-200 text-sm font-medium text-gray-600 hover:border-accent-400 hover:text-accent-500 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
            >
              →
            </button>
          </div>
        )}

        <div className="text-center mt-8 sm:mt-12">
          <a
            href={content.cta.href}
            className="hero-reveal inline-flex items-center gap-2 border-2 border-brand-900 text-brand-900 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded hover:bg-brand-900 hover:text-white transition-all text-sm sm:text-base"
            style={{ animationDelay: "0.7s" }}
          >
            {content.cta.label}
            <svg
              className="w-4 h-4"
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
        </div>
      </div>

      {selected && <Modal item={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}
