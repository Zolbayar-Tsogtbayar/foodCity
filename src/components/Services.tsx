import type { ServicesSections } from "@/lib/site-content-types";

const FEATURE_ICONS = [
  (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9"
      />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
      />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
      />
    </svg>
  ),
  (
    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={1.8}
        d="M13 10V3L4 14h7v7l9-11h-7z"
      />
    </svg>
  ),
];

export default function Services({ content }: { content: ServicesSections }) {
  const { header, features, banner } = content;

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
          {features.map((f, i) => (
            <div
              key={i}
              className="hero-reveal group bg-white border border-gray-100 hover:border-accent-200 rounded p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              style={{ animationDelay: `${0.5 + i * 0.1}s` }}
            >
              <div className="w-12 h-12 bg-accent-50 group-hover:bg-accent-500 text-accent-500 group-hover:text-white rounded flex items-center justify-center mb-5 transition-all duration-300">
                {FEATURE_ICONS[i % FEATURE_ICONS.length]}
              </div>
              <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-2 sm:mb-3">{f.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>

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
    </section>
  );
}
