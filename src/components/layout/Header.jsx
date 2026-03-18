import { Sun, Moon, Menu, LogOut } from "lucide-react";
import useApp from "../../hooks/useApp";
import ShieldLogo from "../ui/ShieldLogo";

export default function Header() {
  const {
    dark, setDark, lang, setLang, page, hdr, bd, txS, aL,
    navTo, setShowAuth, setAdminView, setMobileMenu,
    user, logoutUser, SOCIALS, t,
  } = useApp();

  return (
    <header className={`${hdr} border-b ${bd} sticky top-0 z-40`}>
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
        <button
          onClick={() => navTo("home")}
          className="flex items-center gap-2 flex-shrink-0"
        >
          <ShieldLogo size="sm" dark={dark} wolf={false} />
        </button>
        <nav className="hidden md:flex items-center gap-5">
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
              className={`text-sm font-medium transition ${
                page === k ? "text-amber-500" : txS
              }`}
            >
              {l}
            </button>
          ))}
        </nav>
        <div className="flex items-center gap-1.5">
          <div className="hidden lg:flex gap-1">
            {SOCIALS.map((s) => (
              <a
                key={s.key}
                href={s.url}
                target="_blank"
                rel="noopener noreferrer"
                className={`p-1.5 rounded ${s.color} opacity-60 hover:opacity-100 transition`}
              >
                <s.Icon size={16} />
              </a>
            ))}
          </div>
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg ${
              dark ? "hover:bg-gray-700" : "hover:bg-gray-100"
            }`}
          >
            {dark ? <Sun size={17} /> : <Moon size={17} />}
          </button>
          <button
            onClick={() => setLang(lang === "mn" ? "en" : "mn")}
            className={`px-2 py-1 rounded text-xs font-medium ${aL} text-amber-500`}
          >
            {lang === "mn" ? "EN" : "MN"}
          </button>
          {user ? (
            <>
              {user.isAdmin && (
                <button
                  onClick={() => setAdminView(true)}
                  className="px-2 py-1 rounded text-xs bg-amber-500 text-white"
                >
                  {t.admin}
                </button>
              )}
              <button onClick={logoutUser} className={txS}>
                <LogOut size={17} />
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowAuth(true)}
              className="hidden md:block px-3 py-1.5 rounded-lg text-sm bg-amber-500 text-white"
            >
              {t.login}
            </button>
          )}
          <button
            onClick={() => setMobileMenu(true)}
            className="md:hidden p-2"
          >
            <Menu size={20} />
          </button>
        </div>
      </div>
    </header>
  );
}
