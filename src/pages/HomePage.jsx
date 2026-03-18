import { Phone, Award, Truck, Shield, Wrench, MapPin } from "lucide-react";
import useApp from "../hooks/useApp";
import ShieldLogo from "../components/ui/ShieldLogo";
import { BANNER_IMG } from "../assets/banner";

export default function HomePage() {
  const {
    dark, cd, bd, txS, aL, lang, t,
    navTo, SOCIALS, BIZ,
  } = useApp();

  return (
    <>
      {/* HERO */}
      <section className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>
        <div className="relative w-full">
          <img
            src={BANNER_IMG}
            alt={BIZ.name}
            className="w-full h-auto object-cover"
            style={{ maxHeight: "70vh", width: "100%", objectPosition: "center" }}
          />
          <div
            className="absolute bottom-0 left-0 right-0 h-32"
            style={{ background: "linear-gradient(transparent, #0a0a0a)" }}
          />
        </div>
        <div
          className="relative max-w-4xl mx-auto px-4 -mt-16 pb-10 text-center text-white"
          style={{ zIndex: 2 }}
        >
          <div className="flex justify-center mb-4">
            <ShieldLogo size="lg" dark={true} centered={true} wolf={false} />
          </div>
          <div className="flex flex-wrap gap-3 justify-center mb-4">
            <button
              onClick={() => navTo("services")}
              className="px-6 py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold text-lg shadow-lg shadow-amber-500/25"
            >
              {t.shopNow} →
            </button>
            <button
              onClick={() => navTo("advice")}
              className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 font-semibold backdrop-blur"
            >
              {t.advice}
            </button>
            <a
              href={`tel:${BIZ.phone}`}
              className="px-6 py-3 rounded-xl bg-green-600 hover:bg-green-700 text-white font-semibold flex items-center gap-2"
            >
              <Phone size={18} />
              {BIZ.phone}
            </a>
          </div>
          <div className="flex flex-wrap gap-2 justify-center">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex items-center gap-2 px-4 py-2 rounded-full ${s.bg} text-white text-sm font-medium hover:opacity-90 transition`}
              >
                <s.Icon size={16} className="text-white" />
                {s.label}
                <span className="opacity-70">{s.followers}</span>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* WHY US */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold mb-6 text-center">{t.whyUs}</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            [Award, t.warranty, "Баталгаатай", "text-green-500"],
            [Truck, t.fastService, "Дуудлагаар", "text-blue-500"],
            [Shield, t.quality, "Чанартай", "text-amber-500"],
            [Wrench, t.experienced, "10+ жил", "text-purple-500"],
          ].map(([I, title, sub, clr], i) => (
            <div
              key={i}
              className={`${cd} rounded-xl p-5 border ${bd} text-center`}
            >
              <I size={32} className={`mx-auto mb-3 ${clr}`} />
              <h3 className="font-bold text-sm mb-1">{title}</h3>
              <p className={`text-xs ${txS}`}>{sub}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FLOATING LOCATION SHARE BUTTON */}
      <a
        href={`sms:${BIZ.phone}?body=${encodeURIComponent(
          `📍 ${BIZ.name}\n📌 ${BIZ.address}\n🗺️ ${BIZ.mapUrl}`
        )}`}
        className="fixed bottom-6 right-6 z-50 flex items-center gap-2 px-4 py-3 rounded-full bg-amber-500 hover:bg-amber-600 text-white font-semibold shadow-lg shadow-amber-500/30 transition-all hover:scale-105"
      >
        <MapPin size={20} />
        <span className="text-sm hidden sm:inline">
          {lang === "mn" ? "Байршил илгээх" : "Send Location"}
        </span>
      </a>
    </>
  );
}
