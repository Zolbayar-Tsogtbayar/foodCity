"use client";

import type { ReactNode } from "react";
import type { ContactSections } from "@/lib/site-content-types";
import { useLanguage } from "@/contexts/LanguageContext";

const SOCIAL_META: Record<string, { label: string; color: string; icon: ReactNode }> = {
  facebook: {
    label: "Facebook",
    color: "hover:bg-[#1877F2] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
      </svg>
    ),
  },
  instagram: {
    label: "Instagram",
    color: "hover:bg-gradient-to-br hover:from-[#833ab4] hover:via-[#fd1d1d] hover:to-[#fcb045] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
      </svg>
    ),
  },
  twitter: {
    label: "Twitter / X",
    color: "hover:bg-black hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.745l7.73-8.835L1.254 2.25H8.08l4.259 5.629 5.905-5.629zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77z" />
      </svg>
    ),
  },
  youtube: {
    label: "YouTube",
    color: "hover:bg-[#FF0000] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
      </svg>
    ),
  },
  linkedin: {
    label: "LinkedIn",
    color: "hover:bg-[#0A66C2] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 112.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
      </svg>
    ),
  },
  tiktok: {
    label: "TikTok",
    color: "hover:bg-black hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M12.525.02c1.31-.02 2.61-.01 3.91-.02.08 1.53.63 3.09 1.75 4.17 1.12 1.11 2.7 1.62 4.24 1.79v4.03c-1.44-.05-2.89-.35-4.2-.97-.57-.26-1.1-.59-1.62-.93-.01 2.92.01 5.84-.02 8.75-.08 1.4-.54 2.79-1.35 3.94-1.31 1.92-3.58 3.17-5.91 3.21-1.43.08-2.86-.31-4.08-1.03-2.02-1.19-3.44-3.37-3.65-5.71-.02-.5-.03-1-.01-1.49.18-1.9 1.12-3.72 2.58-4.96 1.66-1.44 3.98-2.13 6.15-1.72.02 1.48-.04 2.96-.04 4.44-.99-.32-2.15-.23-3.02.37-.63.41-1.11 1.04-1.36 1.75-.21.51-.15 1.07-.14 1.61.24 1.64 1.82 3.02 3.5 2.87 1.12-.01 2.19-.66 2.77-1.61.19-.33.4-.67.41-1.06.1-1.79.06-3.57.07-5.36.01-4.03-.01-8.05.02-12.07z" />
      </svg>
    ),
  },
  telegram: {
    label: "Telegram",
    color: "hover:bg-[#26A5E4] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
      </svg>
    ),
  },
  whatsapp: {
    label: "WhatsApp",
    color: "hover:bg-[#25D366] hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
      </svg>
    ),
  },
  website: {
    label: "Вебсайт",
    color: "hover:bg-brand-900 hover:text-white",
    icon: (
      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9" />
      </svg>
    ),
  },
};

const CONTACT_ICONS = [
  (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
      />
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
      />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
      />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
      />
    </svg>
  ),
  (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
      />
    </svg>
  ),
];

export default function Contact({ content }: { content: ContactSections }) {
  const { lang, t } = useLanguage();
  const { hero, items, agent, formTitle, links } = content;

  return (
    <section id="contact" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
          <span
            className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
            style={{ animationDelay: "0.1s" }}
          >
            {hero.badge}
          </span>
          <h2
            className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4"
            style={{ animationDelay: "0.25s" }}
          >
            <span className="text-accent-500">{hero.h2Accent}</span>
          </h2>
          <p
            className="hero-reveal text-gray-500 text-base sm:text-lg"
            style={{ animationDelay: "0.4s" }}
          >
            {hero.intro}
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          <div>
            <div
              className="hero-reveal grid sm:grid-cols-2 lg:grid-cols-1 gap-4 sm:gap-5 mb-8"
              style={{ animationDelay: "0.5s" }}
            >
              {items.map((item, i) => (
                <div key={`${item.title}-${i}`} className="flex items-start gap-4">
                  <div className="w-11 h-11 sm:w-12 sm:h-12 bg-accent-50 text-accent-500 rounded flex items-center justify-center shrink-0">
                    {CONTACT_ICONS[i % CONTACT_ICONS.length]}
                  </div>
                  <div>
                    <div className="font-semibold text-brand-900 text-sm">{item.title}</div>
                    <div className="text-gray-500 text-sm mt-0.5 leading-snug">{item.value}</div>
                  </div>
                </div>
              ))}
            </div>

            <div
              className="hero-reveal bg-brand-900 rounded p-5 sm:p-6 flex items-center gap-4 sm:gap-5"
              style={{ animationDelay: "0.6s" }}
            >
              <div className="w-14 h-14 sm:w-16 sm:h-16 bg-accent-500 rounded text-white flex items-center justify-center text-lg sm:text-xl font-black shrink-0">
                {agent.initials}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-white font-bold text-sm sm:text-base">{agent.name}</div>
                <div className="text-gray-400 text-xs sm:text-sm mb-3">{agent.role}</div>
                <a
                  href={agent.telHref}
                  className="inline-flex items-center gap-2 bg-accent-500 hover:bg-accent-600 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded transition-colors"
                >
                  <svg className="w-4 h-4 shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.27-.27.67-.36 1.02-.24 1.12.37 2.33.57 3.58.57.55 0 1 .45 1 1V20c0 .55-.45 1-1 1-9.39 0-17-7.61-17-17 0-.55.45-1 1-1h3.5c.55 0 1 .45 1 1 0 1.25.2 2.45.57 3.57.11.35.03.74-.24 1.01L6.6 10.8z" />
                  </svg>
                  {agent.telLabel}
                </a>
              </div>
            </div>

            {links && links.length > 0 && (
              <div
                className="hero-reveal mt-4 flex flex-wrap gap-2"
                style={{ animationDelay: "0.65s" }}
              >
                {links.filter((l) => l.href).map((link, i) => {
                  const meta = SOCIAL_META[link.type];
                  return (
                    <a
                      key={i}
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      title={meta?.label ?? link.type}
                      className={`flex items-center gap-2 border border-gray-200 bg-white text-gray-600 rounded px-3 py-2 text-sm font-medium transition-all duration-200 ${meta?.color ?? "hover:bg-gray-100"}`}
                    >
                      {meta?.icon}
                      <span>{meta?.label ?? link.type}</span>
                    </a>
                  );
                })}
              </div>
            )}
          </div>

          <div
            className="hero-reveal bg-brand-50 border border-gray-100 rounded p-5 sm:p-8"
            style={{ animationDelay: "0.7s" }}
          >
            <h3 className="text-lg sm:text-xl font-bold text-brand-900 mb-5 sm:mb-6">{formTitle}</h3>
            <form className="flex flex-col gap-4 sm:gap-5">
              <div className="grid grid-cols-1 xs:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1.5">
                    {t.contact.labels.firstName}
                  </label>
                  <input
                    type="text"
                    placeholder={t.contact.placeholders.firstName}
                    className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-brand-900 mb-1.5">
                    {t.contact.labels.lastName}
                  </label>
                  <input
                    type="text"
                    placeholder={t.contact.placeholders.lastName}
                    className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1.5">
                  {t.contact.labels.email}
                </label>
                <input
                  type="email"
                  placeholder={t.contact.placeholders.email}
                  className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1.5">
                  {t.contact.labels.phone}
                </label>
                <input
                  type="tel"
                  placeholder={t.contact.placeholders.phone}
                  className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1.5">
                  {t.contact.labels.inquiryType}
                </label>
                <select className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition">
                  <option value="">{t.contact.placeholders.inquiryTypeDefault}</option>
                  {t.contact.inquiryTypes.map((type: string) => (
                    <option key={type}>{type}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-brand-900 mb-1.5">
                  {t.contact.labels.message}
                </label>
                <textarea
                  rows={4}
                  placeholder={t.contact.placeholders.message}
                  className="w-full bg-white border border-gray-200 rounded px-4 py-3 text-sm text-brand-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-400 focus:border-transparent transition resize-none"
                />
              </div>
              <button
                type="submit"
                className="w-full bg-accent-500 hover:bg-accent-600 text-white font-bold py-3 sm:py-3.5 rounded transition-colors text-sm sm:text-base"
              >
                {t.contact.submit}
              </button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
