import { X, Phone } from "lucide-react";
import useApp from "../../hooks/useApp";

export default function MobileMenu() {
  const {
    cd, bd, aL, page, t,
    navTo, setShowAuth, setMobileMenu, user, SOCIALS, BIZ,
  } = useApp();

  return (
    <div className="fixed inset-0 z-50" onClick={() => setMobileMenu(false)}>
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`absolute right-0 top-0 bottom-0 w-72 ${cd} p-5 shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={() => setMobileMenu(false)}
          className="absolute top-4 right-4"
        >
          <X size={20} />
        </button>
        <div className="mt-10 space-y-2">
          {[
            ["home", t.home],
            ["services", t.services],
            ["gallery", t.gallery],
            ["advice", t.advice],
            ["contact", t.contact],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => navTo(k)}
              className={`block w-full text-left py-2 px-3 rounded-lg font-medium ${
                page === k ? `${aL} text-amber-500` : ""
              }`}
            >
              {l}
            </button>
          ))}
          <hr className={bd} />
          <div className="flex gap-2">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`flex-1 py-2 rounded-lg text-center text-white text-xs ${s.bg}`}
              >
                <s.Icon size={16} className="mx-auto text-white" />
              </a>
            ))}
          </div>
          <a
            href={`tel:${BIZ.phone.replace(/-/g, "")}`}
            className="flex items-center gap-2 py-2 px-3 rounded-lg bg-green-50 text-green-600 font-medium"
          >
            <Phone size={18} />
            {BIZ.phone}
          </a>
          {!user && (
            <button
              onClick={() => {
                setShowAuth(true);
                setMobileMenu(false);
              }}
              className="w-full py-2 rounded-lg bg-amber-500 text-white font-medium"
            >
              {t.login}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
