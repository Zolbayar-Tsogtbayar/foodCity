"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import type { ProjectsPageSections, ProjectItem } from "@/lib/site-content-types";
import FormattedText from "./FormattedText";

const SPEED = 500;
const VIDEO_EXTS = /\.(mp4|webm|mov|ogg|avi)(\?.*)?$/i;
function isVideo(src: string) { return VIDEO_EXTS.test(src); }

function MediaSlide({
  src,
  alt,
  onVideoPlay,
  onVideoPause,
  active,
}: {
  src: string;
  alt: string;
  onVideoPlay?: () => void;
  onVideoPause?: () => void;
  active: boolean;
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
        className="h-full w-full object-contain"

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

function Modal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const images = project.images.length > 0 ? project.images : (project.coverImage ? [project.coverImage] : []);
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

  useEffect(() => {
    if (images.length <= 1 || incoming !== null || videoPlaying) return;
    const id = setTimeout(() => next(), 3000);
    return () => clearTimeout(id);
  }, [current, incoming, videoPlaying, images.length]);

  const displayIndex = incoming !== null ? incoming : current;

  const slideNodes = (
    <>
      <div className="absolute inset-0 will-change-transform"
        style={{
          transform: entered ? (dir === "left" ? "translateX(-100%)" : "translateX(100%)") : "translateX(0)",
          transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
        }}>
        <MediaSlide src={images[current]} alt={`${project.name} ${current + 1}`} active={incoming === null}
          onVideoPlay={() => setVideoPlaying(true)} onVideoPause={() => setVideoPlaying(false)} />
      </div>
      {incoming !== null && (
        <div className="absolute inset-0 will-change-transform"
          style={{
            transform: entered ? "translateX(0)" : (dir === "left" ? "translateX(100%)" : "translateX(-100%)"),
            transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
          }}>
          <MediaSlide src={images[incoming]} alt={`${project.name} ${incoming + 1}`} active={false} />
        </div>
      )}
    </>
  );

  const arrowNodes = images.length > 1 && (
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

  const closeSvg = (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
    </svg>
  );

  return (
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
            <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-black/25 hover:bg-black/45 text-white backdrop-blur-sm transition-colors">
              {closeSvg}
            </button>
          </div>
          {images.length > 0 && (
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              {slideNodes}
              {arrowNodes}
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
            {project.category && (
              <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">{project.category}</span>
            )}
            <h2 className="text-lg font-bold text-brand-900 mt-0.5 mb-1">
              <FormattedText text={project.name} />
            </h2>
            {project.description && (
              <p className="text-gray-500 text-sm leading-relaxed">
                <FormattedText text={project.description} />
              </p>
            )}
          </div>

        </div>
      </div>

      {/* ── DESKTOP: full-screen lightbox ── hidden below sm ── */}
      <div
        className={`fixed inset-0 z-[500] hidden sm:flex flex-col bg-black transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
        onClick={handleClose}
      >
        <div className="absolute top-4 right-4 z-30">
          <button onClick={handleClose} className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/25 text-white backdrop-blur-sm transition-colors">
            {closeSvg}
          </button>
        </div>
        <div className={`relative flex-1 overflow-hidden transition-transform duration-300 ${visible ? "scale-100" : "scale-[0.97]"}`}>
          {images.length > 0 ? (
            <>
              {slideNodes}
              {arrowNodes}
              <div className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-black/85 via-black/40 to-transparent px-8 pb-6 pt-24">
                <p className="mb-1.5 flex items-center gap-2 text-[11px] uppercase tracking-widest text-white/50">
                  {project.category && <span className="text-accent-400">{project.category}</span>}
                  {project.category && <span>·</span>}
                  {displayIndex + 1} / {images.length}
                  {isVideo(images[displayIndex]) && (
                    <span className="flex items-center gap-1">
                      <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24"><path d="M8 5v14l11-7z" /></svg>Video
                    </span>
                  )}
                </p>
                <h2 className="text-3xl font-bold text-white leading-tight">
                  <FormattedText text={project.name} />
                </h2>
                {project.description && (
                  <p className="mt-1.5 text-base text-white/65 leading-relaxed">
                    <FormattedText text={project.description} />
                  </p>
                )}
              </div>
            </>
          ) : (
            <div className="flex h-full items-center justify-center">
              <div className="text-center p-8">
                {project.category && <p className="text-accent-400 text-xs uppercase tracking-widest mb-2">{project.category}</p>}
                <h2 className="text-3xl font-bold text-white mb-2">{project.name}</h2>
                {project.description && <p className="text-white/60 text-base">{project.description}</p>}
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
    </>
  );
}

export default function Projects({ content }: { content: ProjectsPageSections }) {
  const [selected, setSelected] = useState<ProjectItem | null>(null);

  return (
    <main className="min-h-screen bg-brand-50 pt-28 pb-20">
      {/* Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12 text-center">
        <span className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
          {content.header.badge}
        </span>
        <h1 className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 leading-tight">
          <FormattedText text={content.header.titleLine1} />{" "}
          <span className="text-accent-500">
            <FormattedText text={content.header.titleAccent} />
          </span>
        </h1>
        {content.header.intro && (
          <p className="hero-reveal mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            <FormattedText text={content.header.intro} />
          </p>
        )}
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.items.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Одоогоор төсөл байхгүй байна.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {content.items.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelected(project)}
                className="hero-reveal group text-left rounded overflow-hidden bg-white border border-gray-100 hover:border-accent-200 transition-all duration-300 hover:shadow-xl hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {project.coverImage ? (
                    isVideo(project.coverImage) ? (
                      <video
                        src={resolveMediaUrl(project.coverImage)}
                        muted
                        loop
                        autoPlay
                        playsInline
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <Image
                        src={resolveMediaUrl(project.coverImage)}
                        alt={project.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                        unoptimized
                      />
                    )
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {project.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white rounded px-2 py-0.5">
                      {project.images.length} медиа
                    </span>
                  )}
                </div>
                <div className="p-5 sm:p-6">
                  {project.category && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">
                      {project.category}
                    </span>
                  )}
                  <h3 className="mt-1 text-base font-bold text-brand-900 group-hover:text-accent-500 transition-colors">
                    <FormattedText text={project.name} />
                  </h3>
                  {project.description && (
                    <p className="mt-1.5 text-gray-400 text-sm leading-relaxed">
                      <FormattedText text={project.description} />
                    </p>
                  )}
                </div>

              </button>
            ))}
          </div>
        )}
      </div>

      {selected && <Modal project={selected} onClose={() => setSelected(null)} />}
    </main>
  );
}
