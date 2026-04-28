"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { resolveMediaUrl } from "@/lib/media";
import type { ProjectsPageSections, ProjectItem } from "@/lib/site-content-types";

const SPEED = 900;
const HOLD = 4000;

function Modal({ project, onClose }: { project: ProjectItem; onClose: () => void }) {
  const images = project.images.length > 0 ? project.images : [project.coverImage];
  const [current, setCurrent] = useState(0);
  const [incoming, setIncoming] = useState<number | null>(null);
  const [entered, setEntered] = useState(false);
  const [dir, setDir] = useState<"left" | "right">("left");
  const [paused, setPaused] = useState(false);

  const goTo = (next: number, direction: "left" | "right") => {
    if (next === current || incoming !== null) return;
    setDir(direction);
    setIncoming(next);
    setEntered(false);
    requestAnimationFrame(() => requestAnimationFrame(() => setEntered(true)));
  };

  const prev = () => goTo((current - 1 + images.length) % images.length, "right");
  const next = () => goTo((current + 1) % images.length, "left");

  // Auto-slide
  useEffect(() => {
    if (images.length <= 1 || paused) return;
    const id = setTimeout(() => {
      goTo((current + 1) % images.length, "left");
    }, HOLD);
    return () => clearTimeout(id);
  }, [current, paused, incoming]);

  // After transition: commit incoming as current
  useEffect(() => {
    if (!entered || incoming === null) return;
    const id = setTimeout(() => {
      setCurrent(incoming);
      setIncoming(null);
      setEntered(false);
    }, SPEED);
    return () => clearTimeout(id);
  }, [entered, incoming]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") prev();
      if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [current, incoming]);

  // Lock body scroll
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
        <div
          className="relative aspect-[16/9] overflow-hidden bg-brand-800 cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onMouseDown={() => setPaused(true)}
          onMouseUp={() => setPaused(false)}
        >

          {/* Current image — slides out */}
          <div
            className="absolute inset-0 will-change-transform"
            style={{
              transform: entered
                ? dir === "left" ? "translateX(-100%)" : "translateX(100%)"
                : "translateX(0)",
              transition: entered ? `transform ${SPEED}ms cubic-bezier(0.77,0,0.18,1)` : "none",
            }}
          >
            <Image
              src={resolveMediaUrl(images[current])}
              alt={`${project.name} ${current + 1}`}
              fill
              className="object-cover"
              unoptimized
            />
          </div>

          {/* Incoming image — slides in */}
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
              <Image
                src={resolveMediaUrl(images[incoming])}
                alt={`${project.name} ${incoming + 1}`}
                fill
                className="object-cover"
                unoptimized
              />
            </div>
          )}

          {images.length > 1 && (
            <>
              {/* Prev button */}
              <button
                onClick={prev}
                className="absolute left-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              {/* Next button */}
              <button
                onClick={next}
                className="absolute right-3 top-1/2 -translate-y-1/2 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-black/50 text-white hover:bg-black/80 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </button>

              {/* Dots */}
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

              {/* Counter */}
              <span className="absolute top-3 left-3 z-10 text-xs text-white bg-black/50 rounded px-2 py-1">
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
        <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
          {content.header.badge}
        </span>
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 leading-tight">
          {content.header.titleLine1}{" "}
          <span className="text-accent-500">{content.header.titleAccent}</span>
        </h1>
        {content.header.intro && (
          <p className="mt-4 text-gray-500 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
            {content.header.intro}
          </p>
        )}
      </div>

      {/* Cards grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {content.items.length === 0 ? (
          <p className="text-gray-400 text-center py-20">Одоогоор төсөл байхгүй байна.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {content.items.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelected(project)}
                className="group text-left rounded overflow-hidden bg-white border border-gray-100 hover:border-accent-200 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-gray-100">
                  {project.coverImage ? (
                    <Image
                      src={resolveMediaUrl(project.coverImage)}
                      alt={project.name}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      unoptimized
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                  {project.images.length > 1 && (
                    <span className="absolute bottom-2 right-2 text-xs bg-black/60 text-white rounded px-2 py-0.5">
                      {project.images.length} зураг
                    </span>
                  )}
                </div>
                <div className="p-5">
                  {project.category && (
                    <span className="text-xs font-semibold uppercase tracking-widest text-accent-500">
                      {project.category}
                    </span>
                  )}
                  <h3 className="mt-1 text-base font-bold text-brand-900 group-hover:text-accent-500 transition-colors">
                    {project.name}
                  </h3>
                  {project.description && (
                    <p className="mt-1.5 text-gray-400 text-sm line-clamp-2">{project.description}</p>
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
