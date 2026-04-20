"use client";

import { useState } from "react";
import type { PropertiesPageSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";

export default function Properties({
  content,
}: {
  content: PropertiesPageSections;
}) {
  const categories = content.categories;
  const [active, setActive] = useState("Бүгд");
  const [page, setPage] = useState(0);

  const filtered =
    active === "Бүгд"
      ? content.items
      : content.items.filter((p) => p.category === active);

  const PAGE_SIZE = 9;
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paged = filtered.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

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
          {categories.map((cat) => (
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
          className="hero-reveal grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6"
          style={{ animationDelay: "0.6s" }}
        >
          {paged.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-100 hover:border-accent-200 rounded overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative h-40 overflow-hidden bg-gradient-to-br from-brand-700 to-brand-900 sm:h-48">
                {p.image ? (
                  // eslint-disable-next-line @next/next/no-img-element -- CMS-uploaded absolute/relative paths
                  <img
                    src={resolveMediaUrl(p.image)}
                    alt={p.name}
                    className="h-full w-full object-cover"
                  />
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
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-1">
                  {p.name}
                </h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">
                  {p.description}
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
                    className="shrink-0 bg-brand-900 hover:bg-accent-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded transition-colors duration-200"
                  >
                    Лавлагаа авах
                  </a>
                </div>
              </div>
            </div>
          ))}
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
    </section>
  );
}
