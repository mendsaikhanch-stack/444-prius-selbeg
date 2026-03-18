import {
  Sun, Moon, BarChart3, Globe, Settings,
} from "lucide-react";
import useApp from "../hooks/useApp";
import ShieldLogo from "../components/ui/ShieldLogo";
import OverviewTab from "./tabs/OverviewTab";
import SocialTab from "./tabs/SocialTab";
import SettingsTab from "./tabs/SettingsTab";

export default function AdminPanel() {
  const {
    dark, setDark, lang, setLang, bg, tx, hdr, bd, cd, txS, aL, t,
    adminTab, setAdminTab, setAdminView,
  } = useApp();

  return (
    <div
      className={`min-h-screen ${bg} ${tx} transition-colors duration-300`}
    >
      <header
        className={`${hdr} border-b ${bd} px-4 py-3 flex items-center justify-between sticky top-0 z-40`}
      >
        <div className="flex items-center gap-3">
          <ShieldLogo size="xs" dark={dark} />
          <span
            className={`text-sm px-2 py-0.5 rounded ${aL} text-amber-500 font-medium`}
          >
            {t.admin}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setDark(!dark)}
            className={`p-2 rounded-lg ${cd}`}
          >
            {dark ? <Sun size={16} /> : <Moon size={16} />}
          </button>
          <button
            onClick={() => setLang(lang === "mn" ? "en" : "mn")}
            className={`px-2 py-1 rounded text-xs ${cd}`}
          >
            {lang === "mn" ? "EN" : "MN"}
          </button>
          <button
            onClick={() => setAdminView(false)}
            className="px-3 py-1.5 rounded-lg text-sm bg-amber-500 text-white"
          >
            {lang === "mn" ? "Буцах" : "Back"}
          </button>
        </div>
      </header>
      <div className="flex">
        <aside
          className={`w-52 min-h-screen ${cd} border-r ${bd} p-3 hidden md:block`}
        >
          {[
            ["overview", BarChart3, t.overview],
            ["social", Globe, lang === "mn" ? "Social удирдлага" : "Social Dashboard"],
            ["settings", Settings, t.settings],
          ].map(([k, I, l]) => (
            <button
              key={k}
              onClick={() => setAdminTab(k)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg mb-1 text-left text-sm transition ${
                adminTab === k
                  ? `${aL} text-amber-500 font-medium`
                  : txS
              }`}
            >
              <I size={17} />
              {l}
            </button>
          ))}
        </aside>
        <div
          className={`md:hidden flex overflow-x-auto border-b ${bd} ${cd} w-full`}
        >
          {[
            ["overview", t.overview],
            ["social", "Social"],
            ["settings", t.settings],
          ].map(([k, l]) => (
            <button
              key={k}
              onClick={() => setAdminTab(k)}
              className={`px-4 py-3 text-xs whitespace-nowrap ${
                adminTab === k
                  ? "text-amber-500 font-medium border-b-2 border-amber-500"
                  : txS
              }`}
            >
              {l}
            </button>
          ))}
        </div>
        <main className="flex-1 p-4 md:p-6">
          {adminTab === "overview" && <OverviewTab />}
          {adminTab === "social" && <SocialTab />}
          {adminTab === "settings" && <SettingsTab />}
        </main>
      </div>
    </div>
  );
}
