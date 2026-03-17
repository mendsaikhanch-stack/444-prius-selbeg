import { Phone, MapPin } from "lucide-react";
import useApp from "../../hooks/useApp";
import { models } from "../../data/products";

export default function Footer() {
  const { cd, bd, txS, aL, t, SOCIALS, BIZ, setSelModel, navTo } =
    useApp();
  return (
    <footer className={`${cd} border-t ${bd} mt-12`}>
      <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold mb-3">{t.contact}</h4>
          <div className={`space-y-2 text-sm ${txS} mb-4`}>
            <a
              href={`tel:${BIZ.phone.replace(/-/g, "")}`}
              className="flex items-center gap-2 hover:text-amber-500 transition"
            >
              <Phone size={14} />
              {BIZ.phone}
            </a>
            <a
              href={`tel:${BIZ.phone2.replace(/-/g, "")}`}
              className="flex items-center gap-2 hover:text-amber-500 transition"
            >
              <Phone size={14} />
              {BIZ.phone2}
            </a>
            <a
              href={BIZ.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 hover:text-amber-500 transition"
            >
              <MapPin size={14} />
              {BIZ.address}
            </a>
          </div>
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-2 rounded-lg ${s.color} hover:opacity-80`}
              >
                <s.Icon size={18} />
              </a>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t.parts}</h4>
          <div className={`space-y-1.5 text-sm ${txS}`}>
            {models.map((m) => (
              <button
                key={m}
                onClick={() => {
                  setSelModel(m);
                  navTo("parts");
                }}
                className="block hover:text-amber-500"
              >
                {m}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t.paymentMethod}</h4>
          <div className="flex flex-wrap gap-2">
            {["QPay", "SocialPay", "Хаан банк", "Бэлэн", "Хуваан төлөх"].map(
              (p) => (
                <span
                  key={p}
                  className={`px-2 py-1 rounded text-xs ${aL} text-amber-600`}
                >
                  {p}
                </span>
              )
            )}
          </div>
        </div>
      </div>
      <div className={`border-t ${bd} py-4 text-center text-sm ${txS}`}>
        © 2026 {BIZ.name}
      </div>
    </footer>
  );
}
