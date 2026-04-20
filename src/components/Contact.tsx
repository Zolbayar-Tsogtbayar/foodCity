"use client";

import type { ContactSections } from "@/lib/site-content-types";
import { useLanguage } from "@/contexts/LanguageContext";

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
  const { hero, items, agent, formTitle } = content;

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
