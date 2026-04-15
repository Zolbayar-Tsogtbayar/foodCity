"use client";

import { useState } from "react";

const categories = ["Бүгд", "Түрээс", "Худалдаа", "Оффис Suite", "Хамтын ажлын байр"];

const properties = [
  {
    id: 1, name: "Skyline Оффис Цамхаг А", category: "Түрээс",
    badge: "Онцлох", badgeColor: "bg-accent-500",
    size: "420 м²", floor: "12-р давхар", parking: "8 байр",
    price: "₮4,200,000 / сар", tag: "Premium", tagColor: "text-accent-500",
    description: "Хотын панорама харагдах буланчлагдсан нэгж. Ухаалаг агааржуулалт, өргөгдсөн шалтай бүрэн тохижсон.",
  },
  {
    id: 2, name: "Төв Бизнесийн Цогцолбор", category: "Түрээс",
    badge: "Шинэ", badgeColor: "bg-blue-500",
    size: "180 м²", floor: "5-р давхар", parking: "3 байр",
    price: "₮1,800,000 / сар", tag: "Дунд зэрэг", tagColor: "text-blue-500",
    description: "Хотын төвд нээлттэй планировкатай оффис. Шилэн кабелийн интернет багтсан, шилжиж орход бэлэн.",
  },
  {
    id: 3, name: "Гүйцэтгэх Suite — C Блок", category: "Оффис Suite",
    badge: "Хямдрал", badgeColor: "bg-red-500",
    size: "65 м²", floor: "8-р давхар", parking: "1 байр",
    price: "₮680,000 / сар", tag: "Suite", tagColor: "text-purple-500",
    description: "Хүлээлгийн танхим, хурлын өрөөний эрх, өдөр бүрийн цэвэрлэгээ багтсан хувийн гүйцэтгэх suite.",
  },
  {
    id: 4, name: "Технологийн Хамтын Ажлын Байр", category: "Хамтын ажлын байр",
    badge: null, badgeColor: "",
    size: "10–50 ширээ", floor: "3-р давхар", parking: "Хамтын",
    price: "₮150,000 / ширээ", tag: "Уян хатан", tagColor: "text-green-600",
    description: "Хөдөлгөөнт болон тогтмол ширээ, хувийн pod. Цагийн аль ч үед нэвтрэх, зал болон арга хэмжээний өрөө.",
  },
  {
    id: 5, name: "Коммерц Цамхаг — Бүтэн давхар", category: "Худалдаа",
    badge: "Худалдаа", badgeColor: "bg-brand-800",
    size: "800 м²", floor: "9-р давхар бүгд", parking: "16 байр",
    price: "₮4.8 тэрбум", tag: "Хөрөнгө оруулалт", tagColor: "text-gray-400",
    description: "Нэн тохиромжтой байршилд ховор бүтэн давхрын strata title. Корпорацийн HQ болон хөрөнгө оруулалтад тохиромжтой.",
  },
  {
    id: 6, name: "Инновацийн Парк — 7-р нэгж", category: "Түрээс",
    badge: null, badgeColor: "",
    size: "310 м²", floor: "1 + 2-р давхар", parking: "6 байр",
    price: "₮2,900,000 / сар", tag: "Давхар", tagColor: "text-accent-500",
    description: "Хувийн орцтой хоёр давхрын нэгж. Шоурум, студи эсвэл HQ болгон ашиглахад маш тохиромжтой.",
  },
];

export default function Properties() {
  const [active, setActive] = useState("Бүгд");
  const filtered = active === "Бүгд" ? properties : properties.filter((p) => p.category === active);

  return (
    <section id="properties" className="py-16 sm:py-20 lg:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-8 sm:mb-12">
          <span className="inline-block text-accent-500 font-semibold text-xs uppercase tracking-widest mb-4">
            Боломжит орон зайнууд
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-brand-900 mb-4">
            Бизнестэй <span className="text-accent-500">Нийцэх орон зайгаа олоорой</span>
          </h2>
          <p className="text-gray-500 text-base sm:text-lg">
            Хамтын ажлын байрнаас бүтэн давхар хүртэл — багийнхаа хүсэл эрмэлзэлд
            тохирсон оффисийг түрээслэх эсвэл худалдаж авах боломжтой.
          </p>
        </div>

        {/* Filters */}
        <div className="flex gap-2 sm:gap-3 mb-8 sm:mb-12 overflow-x-auto pb-2 sm:pb-0 sm:flex-wrap sm:justify-center">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActive(cat)}
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filtered.map((p) => (
            <div
              key={p.id}
              className="group bg-white border border-gray-100 hover:border-accent-200 rounded overflow-hidden hover:shadow-2xl transition-all duration-300"
            >
              <div className="relative bg-gradient-to-br from-brand-700 to-brand-900 h-40 sm:h-48 overflow-hidden flex items-end p-4 sm:p-5">
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "linear-gradient(rgba(255,255,255,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.4) 1px, transparent 1px)",
                    backgroundSize: "24px 24px",
                  }}
                />
                <svg viewBox="0 0 120 80" className="absolute right-4 bottom-0 w-20 sm:w-24 opacity-20" fill="white">
                  <rect x="10" y="20" width="30" height="60" />
                  <rect x="50" y="5" width="40" height="75" />
                  <rect x="100" y="35" width="20" height="45" />
                  {[0,1,2].map(r => [15,25,35].map(x => (
                    <rect key={`${r}${x}`} x={x} y={28 + r*18} width="6" height="10" fill="#f97316" opacity="0.8" />
                  )))}
                </svg>
                {p.badge && (
                  <span className={`absolute top-3 left-3 ${p.badgeColor} text-white text-xs font-bold px-2.5 py-1 rounded`}>
                    {p.badge}
                  </span>
                )}
                <span className={`relative z-10 text-xs font-bold uppercase tracking-widest ${p.tagColor} bg-white/10 backdrop-blur-sm px-3 py-1 rounded`}>
                  {p.tag}
                </span>
              </div>

              <div className="p-4 sm:p-6">
                <h3 className="font-bold text-brand-900 text-base sm:text-lg mb-1">{p.name}</h3>
                <p className="text-gray-400 text-sm mb-4 leading-relaxed">{p.description}</p>

                <div className="grid grid-cols-3 gap-2 mb-4 sm:mb-5 py-3 sm:py-4 border-y border-gray-100">
                  {[
                    { icon: "▭", label: p.size },
                    { icon: "≡", label: p.floor },
                    { icon: "⊡", label: p.parking },
                  ].map((spec) => (
                    <div key={spec.label} className="text-center">
                      <div className="text-accent-500 text-xs mb-0.5">{spec.icon}</div>
                      <div className="text-gray-600 text-xs font-medium leading-tight">{spec.label}</div>
                    </div>
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2">
                  <div>
                    <div className="text-xs text-gray-400 uppercase tracking-wide">Эхлэх үнэ</div>
                    <div className="text-accent-500 font-black text-base sm:text-lg leading-tight">{p.price}</div>
                  </div>
                  <a
                    href="#contact"
                    className="shrink-0 bg-brand-900 hover:bg-accent-500 text-white text-xs sm:text-sm font-semibold px-3 sm:px-4 py-2 rounded transition-colors duration-200"
                  >
                    Лавлагаа авах
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-8 sm:mt-12">
          <a
            href="#contact"
            className="inline-flex items-center gap-2 border-2 border-brand-900 text-brand-900 font-bold px-6 sm:px-8 py-3 sm:py-3.5 rounded hover:bg-brand-900 hover:text-white transition-all text-sm sm:text-base"
          >
            Бүх үл хөдлөхийг харах
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M17 8l4 4m0 0l-4 4m4-4H3" />
            </svg>
          </a>
        </div>
      </div>
    </section>
  );
}
