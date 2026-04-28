"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import type { ServicesSections } from "@/lib/site-content-types";

const SPEED = 500;
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isVideo(src: string) { return VIDEO_EXTS.test(src); }

type Feature = ServicesSections["features"][number];

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
    <Image
      src={resolveMediaUrl(src)}
      alt={alt}
      fill
      className="object-cover"
      unoptimized
    />
  );
}

function Modal({ feature, onClose }: { feature: Feature; onClose: () => void }) {
  const images = feature.images.length > 0 ? feature.images : (feature.image ? [feature.image] : []);
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [videoPlaying, setVideoPlaying] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    requestAnimationFrame(() => setVisible(true));
  }, []);

  function handleClose() {
    setVisible(false);
    setTimeout(onClose, 280);
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
    const id = setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
      setEntered(false);
    }, SPEED);
    return () => clearTimeout(id);
  }, [entered, incoming]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
      if (e.key === "ArrowLeft" && !videoPlaying) prev();
      if (e.key === "ArrowRight" && !videoPlaying) next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, incoming, videoPlaying]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  useEffect(() => {
    if (images.length <= 1 || incoming !== null || videoPlaying) return;
    const id = setTimeout(() => next(), 3000);
    return () => clearTimeout(id);
  }, [current, incoming, videoPlaying, images.length]);

  const displayIndex = incoming !== null ? incoming : current;

  return (
    <div
      className={`fixed inset-0 z-[500] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div
        className={`relative w-full max-w-4xl bg-white rounded overflow-hidden shadow-2xl transition-all duration-300 ${visible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={handleClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-brand-900 hover:bg-white shadow transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {images.length > 0 ? (
          <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: entered
                  ? dir === "left" ? "translateX(-100%)" : "translateX(100%)"
                  : "translateX(0)",
                transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
              }}
            >
              <MediaSlide
                src={images[current]}
                alt={`${feature.title} ${current + 1}`}
                active={incoming === null}
                onVideoPlay={() => setVideoPlaying(true)}
                onVideoPause={() => setVideoPlaying(false)}
              />
            </div>

            {incoming !== null && (
              <div
                className="absolute inset-0 will-change-transform"
                style={{
                  transform: entered
                    ? "translateX(0)"
                    : dir === "left" ? "translateX(100%)" : "translateX(-100%)",
                  transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
                }}
              >
                <MediaSlide
                  src={images[incoming]}
                  alt={`${feature.title} ${incoming + 1}`}
                  active={false}
                />
              </div>
            )}

            {images.length > 1 && (
              <>
                <button
                  onClick={prev}
                  className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button
                  onClick={next}
                  className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>

                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-10 flex gap-2">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      onClick={() => goTo(i, i > current ? "left" : "right")}
                      className={`rounded-full transition-all duration-300 ${
                        i === displayIndex ? "w-6 h-2 bg-accent-500" : "w-2 h-2 bg-white/50 hover:bg-white/80"
                      }`}
                    />
                  ))}
                </div>

                <span className="absolute top-3 left-3 z-10 flex items-center gap-1.5 text-xs text-white bg-black/50 rounded px-2 py-1">
                  {isVideo(images[displayIndex]) && (
                    <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  )}
                  {displayIndex + 1} / {images.length}
                </span>
              </>
            )}
          </div>
        ) : null}

        <div className="p-5 sm:p-6">
          <h2 className="text-xl sm:text-2xl font-bold text-brand-900 mb-2">{feature.title}</h2>
          {feature.desc && (
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">{feature.desc}</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Services({ content }: { content: ServicesSections }) {
  const { header, features, banner, slides } = content;
  const [selected, setSelected] = useState<Feature | null>(null);

  const hasGallery = (f: Feature) =>
    f.image || f.images.length > 0;

  return (
    <section id="services" className="py-16 sm:py-20 lg:py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span
            className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            {header.badge}
          </span>
          <h2
            className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4"
            style={{ animationDelay: "0.25s" }}
          >
            {header.h2Line1}{" "}
            <span className="text-accent-500">{header.h2Accent}</span>
          </h2>
          <p
            className="hero-reveal text-gray-500 text-base sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            {header.intro}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {features.map((f, i) => {
            const clickable = hasGallery(f);
            const Tag = clickable ? "button" : "div";
            return (
              <Tag
                key={i}
                {...(clickable ? { onClick: () => setSelected(f) } : {})}
                className={`hero-reveal group text-left bg-white border border-gray-100 rounded overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 hover:border-accent-200 ${clickable ? "cursor-pointer" : ""}`}
                style={{ animationDelay: `${0.5 + i * 0.1}s` }}
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {f.image ? (
                    isVideo(f.image) ? (
                      <video
                        src={resolveMediaUrl(f.image)}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={resolveMediaUrl(f.image)}
                        alt={f.title}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center bg-accent-50 group-hover:bg-accent-100 transition-colors duration-300">
                      <svg className="w-12 h-12 text-accent-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                          d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {f.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white rounded px-2 py-0.5">
                      {f.images.length} медиа
                    </span>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-2 group-hover:text-accent-500 transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">{f.desc}</p>
                </div>
              </Tag>
            );
          })}
        </div>

        {slides.length > 0 && (
          <div className="hero-reveal mt-12 sm:mt-20 rounded overflow-hidden shadow-xl">
            <GallerySlider slides={slides} />
          </div>
        )}

        <div
          className="hero-reveal mt-10 sm:mt-16 bg-brand-900 rounded p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-0 divide-brand-700 divide-y-2 lg:divide-y-0 lg:divide-x"
          style={{ animationDelay: "0.9s" }}
        >
          {banner.map((item) => (
            <div key={item.label} className="py-6 lg:py-0 lg:px-8 text-center">
              <div className="text-3xl sm:text-4xl font-black text-white">
                {item.value}
                <span className="text-accent-500">{item.suffix}</span>
              </div>
              <div className="text-gray-500 text-xs sm:text-sm mt-2 uppercase tracking-wide">{item.label}</div>
            </div>
          ))}
        </div>
      </div>

      {selected && <Modal feature={selected} onClose={() => setSelected(null)} />}
    </section>
  );
}

function SlideMedia({ src, active }: { src: string; active: boolean }) {
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
        muted
        loop
        playsInline
        className="absolute inset-0 h-full w-full object-cover"
      />
    );
  }
  return (
    <Image src={resolveMediaUrl(src)} alt="" fill className="object-cover" unoptimized />
  );
}

function GallerySlider({ slides }: { slides: string[] }) {
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("left");

  const goTo = (next: number, direction: "left" | "right") => {
    if (next === current || incoming !== null) return;
    setDir(direction);
    setIncoming(next);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  const prev = () => goTo((current - 1 + slides.length) % slides.length, "right");
  const next = () => goTo((current + 1) % slides.length, "left");

  useEffect(() => {
    if (!entered || incoming === null) return;
    const id = setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
      setEntered(false);
    }, SPEED);
    return () => clearTimeout(id);
  }, [entered, incoming]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, incoming]);

  useEffect(() => {
    if (slides.length <= 1 || incoming !== null) return;
    const id = setTimeout(() => next(), 3000);
    return () => clearTimeout(id);
  }, [current, incoming, slides.length]);

  const displayIndex = incoming !== null ? incoming : current;

  if (slides.length === 0) return null;

  return (
    <div className="relative aspect-[16/7] sm:aspect-[16/6] overflow-hidden bg-gray-100">
      <div
        className="absolute inset-0 will-change-transform"
        style={{
          transform: entered
            ? dir === "left" ? "translateX(-100%)" : "translateX(100%)"
            : "translateX(0)",
          transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
        }}
      >
        <SlideMedia src={slides[current]} active={incoming === null} />
      </div>

      {incoming !== null && (
        <div
          className="absolute inset-0 will-change-transform"
          style={{
            transform: entered
              ? "translateX(0)"
              : dir === "left" ? "translateX(100%)" : "translateX(-100%)",
            transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
          }}
        >
          <SlideMedia src={slides[incoming]} active={false} />
        </div>
      )}

      {slides.length > 1 && (
        <>
          <button
            onClick={prev}
            className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand-900 hover:bg-white shadow transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <button
            onClick={next}
            className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-11 w-11 items-center justify-center rounded-full bg-white/80 text-brand-900 hover:bg-white shadow transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>

          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10 flex gap-2">
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i, i > current ? "left" : "right")}
                className={`rounded-full transition-all duration-300 ${
                  i === displayIndex ? "w-6 h-2 bg-accent-500" : "w-2 h-2 bg-white/60 hover:bg-white"
                }`}
              />
            ))}
          </div>

          <span className="absolute top-4 right-4 z-10 flex items-center gap-1.5 text-xs bg-white/80 text-brand-900 rounded px-2.5 py-1 shadow">
            {isVideo(slides[displayIndex]) && (
              <svg className="w-3 h-3 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
            )}
            {displayIndex + 1} / {slides.length}
          </span>
        </>
      )}
    </div>
  );
}
