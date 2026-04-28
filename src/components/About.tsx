import type { AboutSections } from "@/lib/site-content-types";
import { resolveMediaUrl } from "@/lib/media";

export default function About({ main }: { main: AboutSections["main"] }) {
  const rawUrl = main.imageUrl?.trim() || "/images/baclground-image-1.jpg";
  const imageUrl = resolveMediaUrl(rawUrl);
  const isVideo = rawUrl.match(/\.(mp4|webm|mov|ogg|avi)$/i);

  return (
    <section
      id="about"
      className="bg-white py-20 sm:py-24 lg:py-28"
    >
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">
          {/* Image/Video block */}
          <div
            className="hero-reveal relative lg:sticky lg:top-28"
            style={{ animationDelay: "0.1s" }}
          >
            <div className="relative rounded overflow-hidden aspect-[4/3]">
              {isVideo ? (
                <video
                  src={imageUrl}
                  autoPlay
                  loop
                  muted
                  playsInline
                  preload="auto"
                  className="absolute inset-0 w-full h-full object-cover"
                />
              ) : (
                <div
                  className="absolute inset-0 bg-cover bg-center"
                  style={{ backgroundImage: `url("${imageUrl}")` }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end justify-start p-6 sm:p-8">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                    backgroundSize: "30px 30px",
                  }}
                />
                <div className="relative z-10">
                  <div className="text-white text-lg sm:text-2xl font-black">
                    {main.imageBuildingName}
                  </div>
                  <div className="text-gray-400 text-sm">
                    {main.imageBuildingSubtitle}
                  </div>
                </div>
              </div>
            </div>
            <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-6 bg-accent-500 text-white rounded px-4 sm:px-6 py-3 sm:py-4 shadow-xl">
              <div className="text-2xl sm:text-3xl font-black">{main.yearsBadgeValue}</div>
              <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">
                {main.yearsLabel}
              </div>
            </div>
          </div>

          {/* Copy */}
          <div className="flex flex-col">
            <span
              className="hero-reveal inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4"
              style={{ animationDelay: "0.2s" }}
            >
              {main.sectionLabel}
            </span>
            <h2
              className="hero-reveal text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 leading-tight mb-5 sm:mb-6"
              style={{ animationDelay: "0.35s" }}
            >
              {main.h2Line1}
              <br />
              <span className="text-accent-500">{main.h2Accent}</span>
            </h2>
            <p
              className="hero-reveal text-gray-500 leading-relaxed mb-5"
              style={{ animationDelay: "0.5s" }}
            >
              {main.p1}
            </p>
            <div className="flex-1" />
            <p
              className="hero-reveal text-gray-500 leading-relaxed mb-8 sm:mb-10"
              style={{ animationDelay: "0.6s" }}
            >
              {main.p2}
            </p>

            <div
              className="hero-reveal grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-100"
              style={{ animationDelay: "0.75s" }}
            >
              {main.stats.map((s) => (
                <div key={s.label}>
                  <div className="text-2xl sm:text-3xl font-black text-brand-900">
                    {s.value}
                  </div>
                  <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide leading-snug">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
