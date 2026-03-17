import {
  Phone, MapPin, Clock, MessageCircle, ExternalLink, Navigation,
  QrCode, CreditCard, Banknote, Calendar,
} from "lucide-react";
import useApp from "../hooks/useApp";

export default function ContactPage() {
  const { cd, bd, txS, aL, t, SOCIALS, BIZ } = useApp();

  return (
    <section className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t.contact}</h2>
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-6">
          {/* Contact Info */}
          <div className={`${cd} rounded-xl border ${bd} p-6 space-y-4`}>
            <div className="flex items-center gap-3">
              <Phone className="text-amber-500" size={20} />
              <div>
                <p className={`text-xs ${txS}`}>{t.phone}</p>
                <a
                  href={`tel:${BIZ.phone.replace(/-/g, "")}`}
                  className="font-bold text-lg hover:text-amber-500 transition flex items-center gap-1"
                >
                  {BIZ.phone}
                  <ExternalLink size={12} className={txS} />
                </a>
                <a
                  href={`tel:${BIZ.phone2.replace(/-/g, "")}`}
                  className="font-bold text-lg hover:text-amber-500 transition flex items-center gap-1"
                >
                  {BIZ.phone2}
                  <ExternalLink size={12} className={txS} />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <MapPin className="text-amber-500" size={20} />
              <div>
                <p className={`text-xs ${txS}`}>{t.address}</p>
                <a
                  href={BIZ.mapUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-medium text-sm hover:text-amber-500 transition flex items-center gap-1"
                >
                  {BIZ.address}
                  <Navigation size={12} className="text-amber-500" />
                </a>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Clock className="text-amber-500" size={20} />
              <div>
                <p className={`text-xs ${txS}`}>{t.workHours}</p>
                <p className="font-medium text-sm">{t.everyDay}</p>
                <p className={`text-sm ${txS}`}>{t.sunday}</p>
              </div>
            </div>
            <div className="space-y-2 pt-2">
              {SOCIALS.map((s) => (
                <a
                  key={s.key}
                  href={s.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`flex items-center gap-3 text-sm ${s.color} hover:underline`}
                >
                  <s.Icon size={18} className={s.color} />
                  {s.label} — {s.followers} {t.followers ?? "дагагч"}
                </a>
              ))}
            </div>
            <div className="flex gap-3 pt-2">
              <a
                href={`tel:${BIZ.phone.replace(/-/g, "")}`}
                className="flex-1 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-semibold text-center flex items-center justify-center gap-2"
              >
                <Phone size={16} />
                {t.callUs}
              </a>
              <a
                href={BIZ.facebook ? `https://m.me/${BIZ.facebook.split('/').pop()}` : "#"}
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-semibold text-center flex items-center justify-center gap-2"
              >
                <MessageCircle size={16} />
                {t.sendMsg}
              </a>
            </div>
          </div>

          {/* Google Map */}
          <div className={`${cd} rounded-xl border ${bd} overflow-hidden`}>
            <iframe
              src={BIZ.mapEmbed}
              width="100%"
              height="300"
              style={{ border: 0 }}
              allowFullScreen=""
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title={`${BIZ.name} - Байршил`}
            />
            <a
              href={BIZ.mapUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex items-center justify-center gap-2 p-3 border-t ${bd} text-sm font-medium text-amber-500 hover:${aL} transition`}
            >
              <Navigation size={16} />
              Google Maps дээр нээх
              <ExternalLink size={14} />
            </a>
          </div>
        </div>

        {/* Payment Methods */}
        <div className={`${cd} rounded-xl border ${bd} p-6 h-fit`}>
          <h3 className="font-bold text-lg mb-4">{t.paymentMethod}</h3>
          <div className="space-y-4">
            {[
              [QrCode, "QPay / SocialPay", t.qpayDesc, "text-blue-500"],
              [
                CreditCard,
                t.bankTransfer,
                `${t.bankName} | ${t.accountNo}`,
                "text-green-600",
              ],
              [Banknote, t.cash, t.cashDesc, "text-amber-600"],
              [Calendar, t.installment, t.installmentDesc, "text-purple-600"],
            ].map(([I, title, desc, clr], i) => (
              <div key={i} className="flex items-start gap-3">
                <I size={24} className={clr} />
                <div>
                  <p className="font-medium text-sm">{title}</p>
                  <p className={`text-xs ${txS}`}>{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
