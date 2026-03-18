import { Phone, MapPin } from "lucide-react";
import useApp from "../../hooks/useApp";

export default function Footer() {
  const { cd, bd, txS, aL, t, SOCIALS, BIZ, navTo } = useApp();
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
            {BIZ.phone2 && (
              <a
                href={`tel:${BIZ.phone2.replace(/-/g, "")}`}
                className="flex items-center gap-2 hover:text-amber-500 transition"
              >
                <Phone size={14} />
                {BIZ.phone2}
              </a>
            )}
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
          <h4 className="font-bold mb-3">{t.services}</h4>
          <div className={`space-y-1.5 text-sm ${txS}`}>
            {[
              t.electricRepair,
              t.plumbing,
              t.heatingRepair,
              t.windowDoor,
              t.ventilation,
              t.generalRepair,
            ].map((s) => (
              <button
                key={s}
                onClick={() => navTo("services")}
                className="block hover:text-amber-500"
              >
                {s}
              </button>
            ))}
          </div>
        </div>
        <div>
          <h4 className="font-bold mb-3">{t.workHours}</h4>
          <div className={`space-y-2 text-sm ${txS}`}>
            <p>{t.everyDay}</p>
            <p>{t.sunday}</p>
          </div>
        </div>
      </div>
      <div className={`border-t ${bd} py-4 text-center text-sm ${txS}`}>
        © 2026 {BIZ.name}
      </div>
    </footer>
  );
}
