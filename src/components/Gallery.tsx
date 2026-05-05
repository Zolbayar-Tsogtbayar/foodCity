"use client";

import { useState, useEffect, useRef } from "react";
import { createPortal } from "react-dom";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import type { GallerySections } from "@/lib/site-content-types";

const SPEED = 500;
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isVideo(src: string) { return VIDEO_EXTS.test(src); }
function isYouTubeOrVimeo(src: string) { return /youtube\.com|youtu\.be|vimeo\.com/i.test(src); }
function getEmbedUrl(url: string) {
  if (url.includes("youtube.com") || url.includes("youtu.be")) {
    const videoId = url.split("v=")[1]?.split("&")[0] || url.split("youtu.be/")[1]?.split("?")[0];
    if (videoId) return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&loop=1&playlist=${videoId}`;
  }
  if (url.includes("vimeo.com")) {
    const videoId = url.split("vimeo.com/")[1]?.split("?")[0];
    if (videoId) return `https://player.vimeo.com/video/${videoId}?autoplay=1&muted=1&loop=1`;
  }
  return url;
}

type GalleryItem = GallerySections["features"][number];

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

  if (isYouTubeOrVimeo(src)) {
    return (
      <iframe
        src={getEmbedUrl(src)}
        className="h-full w-full object-cover"
        allow="autoplay; fullscreen; picture-in-picture"
        allowFullScreen
      />
    );
  }
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
      className="object-contain"

      unoptimized
    />
  );
}

function Modal({ item, onClose }: { item: GalleryItem; onClose: () => void }) {
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
  }, [current, incoming, videoPlaying]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const displayIndex = incoming !== null ? incoming : current;

  return createPortal(
    <div
      className={`fixed inset-0 z-[500] flex flex-col bg-black/95 backdrop-blur-md transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
      onClick={handleClose}
    >
      <div className="absolute top-4 right-4 z-30">
        <button onClick={handleClose}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className={`relative flex-1 overflow-hidden transition-transform duration-300 ${visible ? "scale-100" : "scale-[0.97]"}`}>
        {images.length > 0 && (
          <>
            <div
              className="absolute inset-0 will-change-transform"
              style={{
                transform: entered ? (dir === "left" ? "translateX(-100%)" : "translateX(100%)") : "translateX(0)",
                transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
              }}
            >
              <MediaSlide src={images[current]} alt={`${item.title} ${current + 1}`} active={incoming === null}
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
                <MediaSlide src={images[incoming]} alt={`${item.title} ${incoming + 1}`} active={false} />
              </div>
            )}
            
            {images.length > 1 && (
              <>
                <button onClick={(e) => { e.stopPropagation(); prev(); }}
                  className="absolute left-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <button onClick={(e) => { e.stopPropagation(); next(); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </>
            )}

            <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/80 via-black/40 to-transparent px-8 pb-10 pt-32">
              <div className="max-w-4xl mx-auto">
                <p className="mb-2 flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-white/50 font-bold">
                  {displayIndex + 1} / {images.length}
                  {(isVideo(images[displayIndex]) || isYouTubeOrVimeo(images[displayIndex])) && (
                    <span className="bg-accent-500 text-white px-1.5 py-0.5 rounded text-[10px]">VIDEO</span>
                  )}
                </p>
                <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight">{item.title}</h2>
                {item.desc && <p className="mt-4 text-white/70 text-lg leading-relaxed max-w-2xl">{item.desc}</p>}
              </div>
            </div>
          </>
        )}
      </div>
      {images.length > 1 && (
        <div className="shrink-0 bg-black/40 backdrop-blur-xl border-t border-white/5 px-5 py-4" onClick={(e) => e.stopPropagation()}>
          <div ref={thumbsRef} className="flex gap-3 overflow-x-auto justify-center" style={{ scrollbarWidth: "none" }}>
            {images.map((src, i) => (
              <button key={i} onClick={() => goTo(i, i > current ? "left" : "right")}
                className={`relative shrink-0 h-16 w-24 rounded-lg overflow-hidden transition-all duration-300 ${i === displayIndex ? "ring-2 ring-accent-500 scale-105 opacity-100 shadow-lg" : "opacity-40 hover:opacity-100"}`}>
                {(isVideo(src) || isYouTubeOrVimeo(src)) ? (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
                    <svg className="w-6 h-6 text-white/70" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>
                  </div>
                ) : (
                  <Image src={resolveMediaUrl(src)} alt="" fill className="object-cover" unoptimized />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>,
    document.body
  );
}

function GalleryPost({ item }: { item: GalleryItem }) {
  const [selected, setSelected] = useState(false);
  const validImages = item.images?.filter((m) => m && m.trim()) || [];
  const validImage = item.image?.trim() ? [item.image.trim()] : [];
  
  const media = [];
  if (item.videoUrl?.trim()) media.push(item.videoUrl.trim());
  if (validImage.length > 0 && !media.includes(validImage[0])) media.push(validImage[0]);
  for (const img of validImages) {
    if (!media.includes(img)) media.push(img);
  }
  
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden mb-12 max-w-2xl mx-auto w-full">
      {/* Post Text */}
      <div className="p-5 sm:p-6">
        {item.date && (
          <p className="text-sm font-medium text-gray-500 mb-2">{item.date}</p>
        )}
        <h3 className="text-xl sm:text-2xl font-black text-brand-900 mb-3">{item.title}</h3>
        {item.desc && <p className="text-gray-600 text-base leading-relaxed whitespace-pre-wrap">{item.desc}</p>}
      </div>

      {/* Post Media Grid */}
      {media.length > 0 && (
        <div 
          className={`relative grid gap-1 bg-gray-50 aspect-square sm:aspect-video ${
            media.length === 1 ? "grid-cols-1" : 
            media.length === 2 ? "grid-cols-2" : 
            "grid-cols-2"
          }`}
        >
          {media.slice(0, 4).map((m, idx) => (
            <div 
              key={idx} 
              className={`relative h-full w-full cursor-pointer ${media.length === 3 && idx === 0 ? "row-span-2" : ""}`}
              onClick={() => setSelected(true)}
            >
              {isYouTubeOrVimeo(m) ? (
                <iframe src={getEmbedUrl(m)} className="absolute inset-0 h-full w-full object-cover" allow="autoplay; fullscreen" />
              ) : isVideo(m) ? (
                <video src={resolveMediaUrl(m)} muted loop autoPlay playsInline className="absolute inset-0 h-full w-full object-cover" controls />
              ) : (
                <Image src={resolveMediaUrl(m)} alt="" fill className="object-cover" unoptimized />
              )}
              
              {/* Overlay for +N items */}
              {idx === 3 && media.length > 4 && (
                <div className="absolute inset-0 bg-black/60 flex items-center justify-center text-white text-3xl font-black backdrop-blur-[2px]">
                  +{media.length - 4}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
      <div className="h-1 bg-accent-500 w-full" />

      {selected && <Modal item={item} onClose={() => setSelected(false)} />}
    </div>
  );
}



export default function Gallery({ content }: { content: GallerySections }) {
  const { features } = content;

  return (
    <section id="gallery" className="py-12 sm:py-16 lg:py-20 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          {features.length > 0 ? (
            features.map((item, i) => (
              <GalleryPost key={i} item={item} />
            ))
          ) : (
            <div className="text-center py-20">
              <div className="text-gray-300 mb-4">
                <svg className="w-20 h-20 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-500">Одоогоор пост байхгүй байна.</h3>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
