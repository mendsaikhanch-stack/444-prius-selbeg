import {
  Droplets, Wrench, Flame, Zap, DoorOpen, Paintbrush,
  MessageCircle, Camera, Eye, X, Image, Send,
  RefreshCw, Phone, AlertTriangle, CreditCard,
} from "lucide-react";
import useApp from "../hooks/useApp";
import { models } from "../data/products";

export default function AdvicePage() {
  const {
    dark, cd, bd, txS, aL, inp, lang, t, BIZ,
    adviceModel, setAdviceModel, adviceText, setAdviceText,
    adviceFiles, setAdviceFiles, adviceLoading, setAdviceLoading,
    adviceHistory, setAdviceHistory, addToast,
  } = useApp();

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-2">{t.adviceTitle}</h2>
      <p className={`${txS} mb-6`}>{t.adviceDesc}</p>

      {/* Quick Tips */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-8">
        {[
          [Droplets, "catPlumbing", "tipPlumbing", "text-green-500"],
          [Flame, "catHeating", "tipHeating", "text-blue-500"],
          [Zap, "catElectric", "tipElectric", "text-red-500"],
          [Paintbrush, "catInterior", "tipVentilation", "text-amber-500"],
        ].map(([Icon, catKey, tipKey, clr], i) => (
          <div key={i} className={`${cd} rounded-xl p-4 border ${bd}`}>
            <Icon size={24} className={`${clr} mb-2`} />
            <h4 className="font-bold text-xs mb-1">{t[catKey]}</h4>
            <p className={`text-xs ${txS}`}>{t[tipKey]}</p>
          </div>
        ))}
      </div>

      {/* Ask Question Form */}
      <div className={`${cd} rounded-2xl border ${bd} p-6 mb-8`}>
        <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
          <MessageCircle size={20} className="text-amber-500" />
          {t.askQuestion}
        </h3>

        <div className="mb-4">
          <label className={`block text-sm mb-2 font-medium ${txS}`}>
            {t.selectModel}
          </label>
          <div className="flex flex-wrap gap-2">
            {models.map((m) => (
              <button
                key={m}
                onClick={() => setAdviceModel(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                  adviceModel === m
                    ? "bg-amber-500 text-white"
                    : `border ${bd} hover:border-amber-500`
                }`}
              >
                {m}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className={`block text-sm mb-2 font-medium ${txS}`}>
            {t.describeIssue}
          </label>
          <textarea
            className={`w-full px-4 py-3 rounded-xl border text-sm ${inp} min-h-[120px] resize-none`}
            placeholder={t.advicePlaceholder}
            value={adviceText}
            onChange={(e) => setAdviceText(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <label className={`block text-sm mb-2 font-medium ${txS}`}>
            {t.attachFile}
          </label>
          <div className="flex flex-wrap gap-3">
            {adviceFiles.map((f, i) => (
              <div
                key={i}
                className={`relative flex items-center gap-2 px-3 py-2 rounded-lg border ${bd} ${aL}`}
              >
                {f.type.startsWith("image") ? (
                  <Image size={16} className="text-amber-500" />
                ) : f.type.startsWith("video") ? (
                  <Eye size={16} className="text-blue-500" />
                ) : (
                  <Package size={16} className="text-gray-500" />
                )}
                <span className="text-xs font-medium truncate max-w-[120px]">
                  {f.name}
                </span>
                <span className={`text-xs ${txS}`}>
                  ({(f.size / 1024 / 1024).toFixed(1)}MB)
                </span>
                <button
                  onClick={() =>
                    setAdviceFiles((p) => p.filter((_, j) => j !== i))
                  }
                  className="text-red-500 ml-1"
                >
                  <X size={14} />
                </button>
              </div>
            ))}
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed ${bd} cursor-pointer hover:border-amber-500 transition`}
            >
              <Camera size={18} className="text-amber-500" />
              <span className="text-sm">{t.photo}</span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0])
                    setAdviceFiles((p) => [...p, e.target.files[0]]);
                  e.target.value = "";
                }}
              />
            </label>
            <label
              className={`flex items-center gap-2 px-4 py-2 rounded-lg border-2 border-dashed ${bd} cursor-pointer hover:border-blue-500 transition`}
            >
              <Eye size={18} className="text-blue-500" />
              <span className="text-sm">{t.video}</span>
              <input
                type="file"
                accept="video/*"
                className="hidden"
                onChange={(e) => {
                  if (e.target.files[0])
                    setAdviceFiles((p) => [...p, e.target.files[0]]);
                  e.target.value = "";
                }}
              />
            </label>
          </div>
        </div>

        <button
          disabled={!adviceText.trim() || !adviceModel || adviceLoading}
          onClick={() => {
            setAdviceLoading(true);
            setTimeout(() => {
              const r = {
                answer:
                  lang === "mn"
                    ? "Таны тайлбарлаж буй асуудал нь " +
                      adviceModel +
                      "-д ихэвчлэн тохиолддог. Манай мэргэжилтэн шалгаж үзэх шаардлагатай. Засварчинтай холбогдохыг зөвлөж байна."
                    : "Based on your description, this is a common issue in " +
                      adviceModel +
                      ". Our specialist needs to inspect it. We recommend contacting our repair team.",
                cost: adviceModel.includes("30")
                  ? "50,000-200,000₮"
                  : "30,000-150,000₮",
                urgency: adviceText.length > 50 ? "high" : "med",
              };
              setAdviceHistory((p) => [
                {
                  id: Date.now(),
                  model: adviceModel,
                  question: adviceText,
                  answer: r.answer,
                  cost: r.cost,
                  urgency: r.urgency,
                  date: new Date().toISOString().split("T")[0],
                  files: adviceFiles.map((f) => f.name),
                },
                ...p,
              ]);
              setAdviceText("");
              setAdviceFiles([]);
              setAdviceLoading(false);
              addToast(
                lang === "mn"
                  ? "Зөвлөгөө бэлэн боллоо!"
                  : "Advice ready!"
              );
            }, 2000);
          }}
          className={`w-full py-3 rounded-xl text-white font-semibold flex items-center justify-center gap-2 ${
            !adviceText.trim() || !adviceModel || adviceLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-amber-500 hover:bg-amber-600"
          }`}
        >
          {adviceLoading ? (
            <>
              <RefreshCw size={18} className="animate-spin" />
              {lang === "mn" ? "Боловсруулж байна..." : "Processing..."}
            </>
          ) : (
            <>
              <Send size={18} />
              {t.sendQuestion}
            </>
          )}
        </button>
      </div>

      {/* Advice History */}
      <div>
        <h3 className="font-bold text-lg mb-4">{t.adviceHistory}</h3>
        {adviceHistory.length === 0 ? (
          <p className={`text-center py-8 ${txS}`}>{t.noAdvice}</p>
        ) : (
          <div className="space-y-4">
            {adviceHistory.map((a) => (
              <div
                key={a.id}
                className={`${cd} rounded-xl border ${bd} overflow-hidden`}
              >
                <div
                  className={`p-4 border-b ${bd} ${
                    dark ? "bg-gray-700/30" : "bg-gray-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full ${aL} text-amber-500 font-medium`}
                    >
                      {a.model}
                    </span>
                    <span className={`text-xs ${txS}`}>{a.date}</span>
                  </div>
                  <p className="font-medium text-sm">{a.question}</p>
                  {a.files && a.files.length > 0 && (
                    <div className="flex gap-2 mt-2">
                      {a.files.map((f, i) => (
                        <span
                          key={i}
                          className={`text-xs px-2 py-1 rounded ${aL} flex items-center gap-1`}
                        >
                          <Camera size={10} />
                          {f}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className="w-8 h-8 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0">
                      <Wrench size={16} className="text-white" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-amber-500 mb-1">
                        {t.adviceResponse}
                      </p>
                      <p className="text-sm leading-relaxed">{a.answer}</p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3 mt-3">
                    <span
                      className={`text-xs px-3 py-1.5 rounded-lg ${aL} flex items-center gap-1`}
                    >
                      <CreditCard size={12} className="text-amber-500" />
                      {t.estimatedCost}: <strong>{a.cost}</strong>
                    </span>
                    <span
                      className={`text-xs px-3 py-1.5 rounded-lg flex items-center gap-1 ${
                        a.urgency === "high"
                          ? "bg-red-100 text-red-600"
                          : a.urgency === "med"
                          ? "bg-yellow-100 text-yellow-600"
                          : "bg-green-100 text-green-600"
                      }`}
                    >
                      <AlertTriangle size={12} />
                      {t.urgency}:{" "}
                      <strong>
                        {a.urgency === "high"
                          ? t.urgencyHigh
                          : a.urgency === "med"
                          ? t.urgencyMed
                          : t.urgencyLow}
                      </strong>
                    </span>
                  </div>
                  <a
                    href={`tel:${BIZ.phone}`}
                    className="mt-3 inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-green-500 hover:bg-green-600 text-white text-sm font-medium"
                  >
                    <Phone size={14} />
                    {t.comeToShop} — {t.freeConsult}
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Common Issues Categories */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">{t.adviceCategories}</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {[
            [Droplets, "catPlumbing", "text-green-500", "bg-green-50"],
            [Flame, "catHeating", "text-blue-500", "bg-blue-50"],
            [Zap, "catElectric", "text-red-500", "bg-red-50"],
            [DoorOpen, "catWindowDoor", "text-purple-500", "bg-purple-50"],
            [Paintbrush, "catInterior", "text-amber-500", "bg-amber-50"],
            [Wrench, "catElevator", "text-teal-500", "bg-teal-50"],
          ].map(([Icon, key, clr, bgClr], i) => (
            <button
              key={i}
              onClick={() => {
                setAdviceText(t[key] + " - ");
                document.querySelector("textarea")?.focus();
              }}
              className={`${cd} rounded-xl p-4 border ${bd} hover:shadow-md transition text-left flex items-center gap-3`}
            >
              <div
                className={`w-10 h-10 rounded-lg ${
                  dark ? aL : bgClr
                } flex items-center justify-center`}
              >
                <Icon size={20} className={clr} />
              </div>
              <span className="font-medium text-sm">{t[key]}</span>
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
