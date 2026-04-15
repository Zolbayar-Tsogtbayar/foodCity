const stats = [
  { value: "18+",  label: "Жилийн туршлага" },
  { value: "340+", label: "Дууссан төсөл" },
  { value: "98%",  label: "Үйлчлүүлэгчийн сэтгэл ханамж" },
  { value: "60+",  label: "Мэргэжилтэн инженер" },
];

const features = [
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-2 10v-5a1 1 0 00-1-1h-2a1 1 0 00-1 1v5m4 0H9" />
      </svg>
    ),
    title: "Арилжааны барилга",
    desc: "Суурь тавихаас эхлэн ашиглалтад өгөх хүртэлх бүрэн цогц барилгын ажил. Бид хяналт, ил тод байдлыг чухалчилдаг.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Уян хатан оффис түрээс",
    desc: "Богино болон урт хугацааны түрээсийн сонголт. Тохижуулсан эсвэл гол бүтэцтэй хувилбар байдаг.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8}
          d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    title: "Интерьер дизайн & Тохижилт",
    desc: "Таны брэндийн онцлогт тохирсон интерьерийн шийдлүүд. Нээлттэй, хаалттай болон хосолсон байршлын загвар.",
  },
  {
    icon: (
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    ),
    title: "Ухаалаг барилгын систем",
    desc: "Орчин үеийн ажлын байрны агааржуулалт, гэрэлтүүлэг, нэвтрэлтийн хяналт болон эрчим хүчний менежментийн систем.",
  },
];

export default function About() {
  return (
    <>
      {/* ── Бидний тухай ── */}
      <section id="about" className="py-16 sm:py-20 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
            {/* Image block */}
            <div className="relative">
              <div className="relative rounded overflow-hidden aspect-[4/3]">
                <div className="absolute inset-0 bg-gradient-to-br from-brand-700 to-brand-900 flex items-end justify-start p-6 sm:p-8">
                  <div
                    className="absolute inset-0 opacity-10"
                    style={{
                      backgroundImage:
                        "linear-gradient(rgba(255,255,255,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.5) 1px, transparent 1px)",
                      backgroundSize: "30px 30px",
                    }}
                  />
                  <svg viewBox="0 0 380 260" className="absolute inset-0 w-full h-full opacity-20" fill="none">
                    <rect x="60" y="60" width="100" height="200" fill="white" />
                    <rect x="180" y="20" width="140" height="240" fill="white" />
                    <rect x="340" y="120" width="40" height="140" fill="white" />
                    {[...Array(5)].map((_, r) =>
                      [75, 100, 125].map((x) => (
                        <rect key={`a${r}${x}`} x={x} y={80 + r * 32} width="16" height="22" fill="#f97316" opacity="0.7" />
                      ))
                    )}
                    {[...Array(7)].map((_, r) =>
                      [195, 225, 255, 285].map((x) => (
                        <rect key={`b${r}${x}`} x={x} y={40 + r * 30} width="16" height="20" fill="#f97316" opacity="0.6" />
                      ))
                    )}
                  </svg>
                  <div className="relative z-10">
                    <div className="text-white text-lg sm:text-2xl font-black">FoodCity ТТ Цамхаг</div>
                    <div className="text-gray-400 text-sm">Улаанбаатар хотын бизнесийн төв</div>
                  </div>
                </div>
              </div>
              <div className="absolute -bottom-5 -right-3 sm:-bottom-6 sm:-right-6 bg-accent-500 text-white rounded px-4 sm:px-6 py-3 sm:py-4 shadow-xl">
                <div className="text-2xl sm:text-3xl font-black">18+</div>
                <div className="text-xs font-semibold opacity-90 uppercase tracking-wide">Жилийн туршлага</div>
              </div>
            </div>

            {/* Copy */}
            <div className="mt-8 sm:mt-10 lg:mt-0">
              <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
                Дизайн &amp; Бүтэц
              </span>
              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 leading-tight mb-5 sm:mb-6">
                Ажлыг урамшуулах
                <br />
                <span className="text-accent-500">Орон зай бүтээдэг</span>
              </h2>
              <p className="text-gray-500 leading-relaxed mb-5">
                FoodCity нь Улаанбаатарын тэргүүлэх арилжааны барилга угсралт болон
                оффис түрээслүүлэх групп юм. 18 гаруй жилийн туршлагатай бид
                Монгол болон Зүүн Өмнөд Азид шагналт оффисийн цамхаг, олон
                зориулалттай цогцолбор, premium менежментийн ажлын байрнуудыг
                хүргэж ирсэн.
              </p>
              <p className="text-gray-500 leading-relaxed mb-8 sm:mb-10">
                Бид дизайн, барилга, менежментийг нэгдсэн байдлаар хэрэгжүүлдэг
                тул үйлчлүүлэгчид суурь тавихаас өдөр тутмын үйл ажиллагаа хүртэл
                нэг цэгийн хариуцлагатай харилцдаг.
              </p>

              <div className="grid grid-cols-2 gap-4 sm:gap-6 pt-6 sm:pt-8 border-t border-gray-100">
                {stats.map((s) => (
                  <div key={s.label}>
                    <div className="text-2xl sm:text-3xl font-black text-brand-900">{s.value}</div>
                    <div className="text-gray-400 text-xs mt-1 uppercase tracking-wide leading-snug">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Үндсэн давуу талууд ── */}
      <section id="services" className="py-16 sm:py-20 lg:py-24 bg-brand-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-16">
            <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
              Бидний санал болгох зүйл
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4">
              Үндсэн <span className="text-accent-500">Давуу талууд</span>
            </h2>
            <p className="text-gray-500 text-base sm:text-lg">
              Чанар, хурд, урт хугацааны үнэ цэнийг шаардсан бизнесүүдэд зориулсан иж бүрэн шийдлүүд.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {features.map((f, i) => (
              <div
                key={i}
                className="group bg-white border border-gray-100 hover:border-accent-200 rounded p-6 sm:p-8 hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
              >
                <div className="w-12 h-12 bg-accent-50 group-hover:bg-accent-500 text-accent-500 group-hover:text-white rounded flex items-center justify-center mb-5 transition-all duration-300">
                  {f.icon}
                </div>
                <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-2 sm:mb-3">{f.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>

          {/* Counter banner */}
          <div className="mt-10 sm:mt-16 bg-brand-900 rounded p-6 sm:p-10 grid grid-cols-2 lg:grid-cols-4 gap-0 divide-brand-700 divide-y-2 lg:divide-y-0 lg:divide-x">
            {[
              { value: "120К", suffix: " м²", label: "Нийт хөгжүүлсэн талбай" },
              { value: "85+",  suffix: "",    label: "Боломжтой оффисийн нэгж" },
              { value: "1,200+", suffix: "",  label: "Байрлуулсан бизнес" },
              { value: "4.8",  suffix: "/5",  label: "Үйлчлүүлэгчийн үнэлгээ" },
            ].map((item) => (
              <div key={item.label} className="py-6 lg:py-0 lg:px-8 text-center">
                <div className="text-3xl sm:text-4xl font-black text-white">
                  {item.value}<span className="text-accent-500">{item.suffix}</span>
                </div>
                <div className="text-gray-500 text-xs sm:text-sm mt-2 uppercase tracking-wide">{item.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}
