"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import type { ProjectsPageSections, ProjectItem } from "@/lib/site-content-types";

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

function Modal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const images = project.images.length > 0 ? project.images : [project.coverImage];
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [videoPlaying, setVideoPlaying] = useState(false);

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
      if (e.key === "Escape") onClose();
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

  return (
    <div
      className="fixed inset-0 z-[500] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-4xl bg-brand-900 rounded-xl overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 z-20 flex h-9 w-9 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Slideshow */}
        <div className="relative aspect-[16/9] overflow-hidden bg-brand-800">
          {/* Current slide — slides out */}
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
              alt={`${project.name} ${current + 1}`}
              active={incoming === null}
              onVideoPlay={() => setVideoPlaying(true)}
              onVideoPause={() => setVideoPlaying(false)}
            />
          </div>

          {/* Incoming slide — slides in */}
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
                alt={`${project.name} ${incoming + 1}`}
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

        {/* Info */}
        <div className="p-5 sm:p-6">
          {project.category && (
            <span className="inline-block text-xs font-semibold uppercase tracking-widest text-accent-500 mb-2">
              {project.category}
            </span>
          )}
          <h2 className="text-xl sm:text-2xl font-bold text-white mb-2">{project.name}</h2>
          {project.description && (
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">{project.description}</p>
          )}
        </div>
      </div>
    </div>
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
          {content.header.titleLine1}{" "}
          <span className="text-accent-500">{content.header.titleAccent}</span>
        </h1>
        {content.header.intro && (
          <p className="hero-reveal mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {content.header.intro}
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
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-1.5 text-gray-400 text-sm leading-relaxed line-clamp-2">{project.description}</p>
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
