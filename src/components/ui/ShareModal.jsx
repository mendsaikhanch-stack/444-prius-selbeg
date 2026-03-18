import { X, Copy, MessageCircle, Send } from "lucide-react";
import useApp from "../../hooks/useApp";
import { getShareUrl, fmt } from "../../utils/helpers";

export default function ShareModal({ product, onClose }) {
  const { cd, aL, bd, lang, t, SOCIALS, BIZ, addToast } = useApp();
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/50" />
      <div
        className={`relative ${cd} rounded-2xl p-6 w-full max-w-sm shadow-2xl`}
        onClick={(e) => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute top-3 right-3">
          <X size={18} />
        </button>
        <h3 className="font-bold text-lg mb-4">{t.shareToSocial}</h3>
        <div className={`p-3 rounded-xl ${aL} mb-4`}>
          {product.img && product.img.startsWith("http") ? (
            <img
              src={product.img}
              alt=""
              className="w-full h-32 object-cover rounded-lg mb-2"
            />
          ) : (
            <p className="text-3xl text-center mb-2">
              {product.emoji || "📦"}
            </p>
          )}
          <p className="font-medium text-sm text-center">
            {lang === "mn" ? product.name.mn : product.name.en}
          </p>
          <p className="text-amber-500 font-bold text-center">
            {fmt(product.price)}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-2 mb-2">
          {SOCIALS.map((s) => (
            <a
              key={s.key}
              href={getShareUrl(product, s.key, lang, fmt, BIZ)}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-white font-medium text-sm ${s.bg}`}
            >
              <s.Icon size={16} className="text-white" />
              {s.label}
            </a>
          ))}
        </div>
        <div className="grid grid-cols-3 gap-2 mb-3">
          <a
            href={getShareUrl(product, "messenger", lang, fmt, BIZ)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-blue-500 text-white text-xs font-medium"
          >
            <MessageCircle size={14} />
            Messenger
          </a>
          <a
            href={getShareUrl(product, "viber", lang, fmt, BIZ)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-purple-500 text-white text-xs font-medium"
          >
            <Send size={14} />
            Viber
          </a>
          <a
            href={getShareUrl(product, "whatsapp", lang, fmt, BIZ)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-1.5 px-2 py-2 rounded-xl bg-green-500 text-white text-xs font-medium"
          >
            <MessageCircle size={14} />
            WhatsApp
          </a>
        </div>
        <button
          onClick={() => {
            const text = `🏠 ${
              lang === "mn" ? product.name.mn : product.name.en
            } - ${fmt(product.price)}\n✅ СӨХ үйлчилгээ\n📍 ${
              BIZ.address
            }\n☎️ ${BIZ.phone}`;
            navigator.clipboard?.writeText(text);
            addToast(lang === "mn" ? "Хуулагдлаа!" : "Copied!");
            onClose();
          }}
          className={`w-full py-2.5 rounded-xl border ${bd} flex items-center justify-center gap-2 text-sm font-medium`}
        >
          <Copy size={16} />
          {lang === "mn" ? "Текст хуулах" : "Copy Text"}
        </button>
      </div>
    </div>
  );
}
