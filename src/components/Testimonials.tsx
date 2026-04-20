"use client";

import { useState } from "react";
import type { TeamPageSections } from "@/lib/site-content-types";

type Props = { content: TeamPageSections };

const PAGE_SIZE = 9;

export default function Team({ content }: Props) {
  const { header, members, cta } = content;
  const [page, setPage] = useState(0);

  const totalPages = Math.ceil(members.length / PAGE_SIZE);
  const paged = members.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);

  return (
    <section id="team" className="py-16 sm:py-20 lg:py-24 bg-brand-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span
            className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            {header.eyebrow}
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

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {paged.map((member, i) => (
            <div
              key={`${member.email}-${i}`}
              className="hero-reveal bg-white border border-gray-100 hover:border-accent-200 rounded overflow-hidden hover:shadow-xl transition-all duration-300"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="relative bg-brand-900 h-24 sm:h-28 flex items-end px-5 sm:px-6 pb-0">
                <div
                  className={`absolute top-3 sm:top-4 right-3 sm:right-4 text-xs font-bold text-white ${member.color} px-2 sm:px-2.5 py-1 rounded uppercase tracking-wider max-w-[60%] text-right line-clamp-1`}
                >
                  {member.role}
                </div>
                <div
                  className={`relative z-10 w-14 h-14 sm:w-16 sm:h-16 ${member.color} rounded text-white flex items-center justify-center text-lg sm:text-xl font-black shadow-lg translate-y-7 sm:translate-y-8`}
                >
                  {member.initials}
                </div>
              </div>

              <div className="pt-10 sm:pt-12 px-5 sm:px-6 pb-5 sm:pb-6">
                <h3 className="font-bold text-brand-900 text-base sm:text-lg">
                  {member.name}
                </h3>
                <p className="text-gray-400 text-sm mt-2 leading-relaxed mb-4">
                  {member.bio}
                </p>

                <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                  <div className="text-center shrink-0">
                    <div className="text-xl sm:text-2xl font-black text-brand-900">
                      {member.projects}
                    </div>
                    <div className="text-gray-400 text-xs uppercase tracking-wide mt-0.5">
                      Төслүүд
                    </div>
                  </div>
                  <div className="w-px h-10 bg-gray-100 shrink-0" />
                  <div className="flex-1 flex flex-col gap-1.5 min-w-0">
                    <a
                      href={`tel:${member.phone.replace(/\s/g, "")}`}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent-500 transition-colors truncate"
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" />
                      </svg>
                      <span className="truncate">{member.phone}</span>
                    </a>
                    <a
                      href={`mailto:${member.email}`}
                      className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-accent-500 transition-colors truncate"
                    >
                      <svg
                        className="w-3.5 h-3.5 shrink-0"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                      <span className="truncate">{member.email}</span>
                    </a>
                  </div>
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
                    ? "bg-accent-500 text-white"
                    : "border border-gray-200 text-gray-600 hover:border-accent-400 hover:text-accent-500"
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

        <div
          className="hero-reveal mt-10 sm:mt-16 bg-accent-500 rounded p-6 sm:p-8 flex flex-col sm:flex-row items-center justify-between gap-4 sm:gap-6 text-center sm:text-left"
          style={{ animationDelay: "1.1s" }}
        >
          <div className="text-white">
            <h3 className="text-xl sm:text-2xl font-black mb-1">{cta.title}</h3>
            <p className="text-accent-100 text-sm">{cta.subtitle}</p>
          </div>
          <a
            href={cta.buttonHref}
            className="shrink-0 bg-white text-accent-600 font-bold px-6 sm:px-8 py-3 rounded hover:bg-accent-50 transition-colors whitespace-nowrap text-sm sm:text-base"
          >
            {cta.buttonLabel}
          </a>
        </div>
      </div>
    </section>
  );
}
