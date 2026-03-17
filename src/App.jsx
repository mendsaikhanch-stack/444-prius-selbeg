import { useState, useEffect, useRef } from "react";

/* ─── DATA ─── */
const ANNOUNCEMENTS = [
  { id: 1, icon: "💧", text: "Маргааш 10:00-18:00 ус тасарна", date: "2026.03.14", urgent: true },
  { id: 2, icon: "🏢", text: "СӨХ хурал 03/20-нд болно", date: "2026.03.12", urgent: false },
  { id: 3, icon: "⚡", text: "Цахилгааны тариф шинэчлэгдлээ", date: "2026.03.10", urgent: false },
];

const INIT_PAYMENTS = [
  { id: 1, month: "2026.03", label: "СӨХ төлбөр", amount: 80000, paid: false },
  { id: 2, month: "2026.02", label: "СӨХ төлбөр", amount: 80000, paid: true },
  { id: 3, month: "2026.01", label: "СӨХ төлбөр", amount: 80000, paid: true },
  { id: 4, month: "2025.12", label: "СӨХ төлбөр", amount: 80000, paid: true },
];

const INIT_REQUESTS = [
  { id: 1, unit: 45, cat: "Лифт", title: "Лифт эвдэрсэн", desc: "3-р давхрын лифт ажиллахгүй байна", status: "progress", date: "2026.03.10" },
  { id: 2, unit: 45, cat: "Цэвэрлэгээ", title: "Цэвэрлэгээ муу", desc: "Шатны цэвэрлэгээ хийгдээгүй", status: "done", date: "2026.03.05" },
  { id: 3, unit: 32, cat: "Ус", title: "Ус алдаж байна", desc: "Угаалгын өрөөнөөс ус гоожиж байна", status: "open", date: "2026.03.13" },
  { id: 4, unit: 46, cat: "Бусад", title: "Хаалга эвдэрсэн", desc: "Оролтын хаалганы түгжээ ажиллахгүй", status: "open", date: "2026.03.11" },
];

const UNITS = [
  { id: 45, block: "A", size: 65, type: "Owner", residents: 3, parking: "#12", paid: true },
  { id: 46, block: "A", size: 70, type: "Owner", residents: 2, parking: "#13", paid: false },
  { id: 47, block: "A", size: 60, type: "Tenant", residents: 4, parking: "-", paid: true },
  { id: 32, block: "B", size: 55, type: "Owner", residents: 2, parking: "#08", paid: false },
  { id: 33, block: "B", size: 80, type: "Tenant", residents: 1, parking: "#09", paid: true },
  { id: 51, block: "A", size: 72, type: "Owner", residents: 3, parking: "#15", paid: false },
];

const EXPENSES = [
  { id: 1, label: "Цэвэрлэгээ", amount: 500000, icon: "🧹" },
  { id: 2, label: "Харуул хамгаалалт", amount: 800000, icon: "🛡️" },
  { id: 3, label: "Засвар үйлчилгээ", amount: 300000, icon: "🔧" },
  { id: 4, label: "Цахилгаан", amount: 450000, icon: "⚡" },
  { id: 5, label: "Лифт засвар", amount: 200000, icon: "🛗" },
];

const fmt = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") + "₮";

const STATUS_MAP = {
  open: { label: "Нээлттэй", color: "#EF4444", bg: "#EF444418" },
  progress: { label: "Шийдвэрлэж байна", color: "#F59E0B", bg: "#F59E0B18" },
  done: { label: "Шийдсэн", color: "#22C55E", bg: "#22C55E18" },
};

/* ─── STYLES ─── */
const S = {
  app: {
    fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
    background: "#F0F2F5", minHeight: "100vh", color: "#1A1A2E",
    maxWidth: 440, margin: "0 auto", position: "relative", overflow: "hidden",
  },
  adminApp: {
    fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
    background: "#F0F2F5", minHeight: "100vh", color: "#1A1A2E",
    maxWidth: 900, margin: "0 auto", position: "relative",
  },
  header: {
    background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
    padding: "20px 20px 18px", color: "#fff", position: "sticky", top: 0, zIndex: 50,
  },
  card: {
    background: "#fff", borderRadius: 16, padding: 20, margin: "0 16px 12px",
    boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
  },
  btn: (bg = "#2563EB") => ({
    background: bg, color: "#fff", border: "none", borderRadius: 12,
    padding: "12px 24px", fontWeight: 600, fontSize: 14, cursor: "pointer",
    width: "100%", transition: "all 0.2s",
  }),
  btnOutline: {
    background: "transparent", color: "#2563EB", border: "2px solid #2563EB",
    borderRadius: 12, padding: "10px 20px", fontWeight: 600, fontSize: 13, cursor: "pointer",
  },
  input: {
    width: "100%", padding: "12px 16px", borderRadius: 12, border: "1.5px solid #E2E8F0",
    fontSize: 14, outline: "none", boxSizing: "border-box", background: "#F8FAFC",
    transition: "border 0.2s",
  },
  tab: (active) => ({
    flex: 1, padding: "10px 0", textAlign: "center", fontSize: 11, fontWeight: 600,
    color: active ? "#2563EB" : "#94A3B8", background: "none", border: "none",
    borderTop: active ? "2px solid #2563EB" : "2px solid transparent",
    cursor: "pointer", transition: "all 0.2s", paddingTop: 8,
  }),
  badge: (color, bg) => ({
    display: "inline-block", padding: "3px 10px", borderRadius: 20,
    fontSize: 11, fontWeight: 600, color, background: bg,
  }),
};

/* ─── RESIDENT APP SCREENS ─── */

function ResidentHome({ payments, requests, goTo, org }) {
  const unpaid = payments.filter(p => !p.paid).reduce((s, p) => s + p.amount, 0);
  const accent = org?.color || "#2563EB";
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ ...S.header, background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`, paddingBottom: 24 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 8 }}>
          {org?.logo ? (
            <img src={org.logo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", background: "#fff", padding: 2 }} />
          ) : (
            <div style={{ width: 36, height: 36, borderRadius: 8, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18 }}>🏢</div>
          )}
          <div style={{ fontSize: 14, fontWeight: 700 }}>{org?.name || "СӨХ"}</div>
        </div>
        <div style={{ fontSize: 13, opacity: 0.8 }}>Сайн байна уу 👋</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginTop: 4 }}>A блок, 45 тоот</div>
      </div>

      {/* Balance Card */}
      <div style={{ ...S.card, marginTop: -8, background: "linear-gradient(135deg, #1E3A5F 0%, #0F172A 100%)", color: "#fff" }}>
        <div style={{ fontSize: 12, opacity: 0.7 }}>Төлбөрийн үлдэгдэл</div>
        <div style={{ fontSize: 32, fontWeight: 800, margin: "8px 0 16px", letterSpacing: -1 }}>
          {fmt(unpaid)}
        </div>
        <button onClick={() => goTo("payments")} style={{ ...S.btn("#2563EB"), width: "100%" }}>
          Төлөх →
        </button>
      </div>

      {/* Announcements */}
      <div style={{ padding: "16px 16px 4px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>📢 Зарлал</div>
        {ANNOUNCEMENTS.map(a => (
          <div key={a.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            background: a.urgent ? "#FEF2F2" : "#fff", borderRadius: 12, marginBottom: 8,
            border: a.urgent ? "1px solid #FECACA" : "1px solid #F1F5F9",
          }}>
            <span style={{ fontSize: 20 }}>{a.icon}</span>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 13, fontWeight: 600 }}>{a.text}</div>
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{a.date}</div>
            </div>
            {a.urgent && <span style={S.badge("#EF4444", "#FEE2E2")}>Яаралтай</span>}
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>⚡ Хурдан үйлдэл</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
          {[
            { icon: "⚡", label: "Хэрэглээ", screen: "utilities" },
            { icon: "📝", label: "Гомдол", screen: "requests" },
            { icon: "💳", label: "Төлбөр", screen: "payments" },
            { icon: "🏠", label: "Миний байр", screen: "myUnit" },
          ].map(q => (
            <button key={q.label} onClick={() => goTo(q.screen)} style={{
              display: "flex", alignItems: "center", gap: 10, padding: "16px 14px",
              background: "#fff", borderRadius: 14, border: "1px solid #F1F5F9",
              cursor: "pointer", transition: "all 0.2s", fontSize: 13, fontWeight: 600, color: "#1A1A2E",
            }}>
              <span style={{ fontSize: 22 }}>{q.icon}</span>
              {q.label}
            </button>
          ))}
        </div>
      </div>

      {/* Recent Requests */}
      <div style={{ padding: "12px 16px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <div style={{ fontSize: 15, fontWeight: 700 }}>🔧 Миний хүсэлтүүд</div>
          <button onClick={() => goTo("requests")} style={{ background: "none", border: "none", color: "#2563EB", fontSize: 12, fontWeight: 600, cursor: "pointer" }}>Бүгдийг харах →</button>
        </div>
        {requests.filter(r => r.unit === 45).slice(0, 2).map(r => {
          const st = STATUS_MAP[r.status];
          return (
            <div key={r.id} style={{ ...S.card, margin: "0 0 8px", padding: 14 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontWeight: 600, fontSize: 13 }}>{r.title}</div>
                <span style={S.badge(st.color, st.bg)}>{st.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function PaymentsScreen({ payments, onPay, goTo }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => goTo("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Миний төлбөр</div>
        </div>
      </div>
      <div style={{ padding: "16px 0" }}>
        {payments.map(p => (
          <div key={p.id} style={{ ...S.card, display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div>
              <div style={{ fontSize: 12, color: "#94A3B8", fontWeight: 500 }}>{p.month}</div>
              <div style={{ fontSize: 14, fontWeight: 600, marginTop: 4 }}>{p.label}</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4, color: p.paid ? "#22C55E" : "#1A1A2E" }}>{fmt(p.amount)}</div>
            </div>
            {p.paid ? (
              <span style={S.badge("#22C55E", "#DCFCE7")}>✓ Төлсөн</span>
            ) : (
              <button onClick={() => onPay(p.id)} style={{ ...S.btn(), padding: "10px 20px", width: "auto" }}>Төлөх</button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function PayScreen({ payment, onConfirm, goTo }) {
  const [method, setMethod] = useState("qpay");
  const [processing, setProcessing] = useState(false);

  const handlePay = () => {
    setProcessing(true);
    setTimeout(() => {
      onConfirm();
      setProcessing(false);
    }, 1500);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => goTo("payments")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Төлбөр төлөх</div>
        </div>
      </div>
      <div style={{ ...S.card, marginTop: 16, textAlign: "center" }}>
        <div style={{ fontSize: 13, color: "#94A3B8" }}>{payment.label}</div>
        <div style={{ fontSize: 36, fontWeight: 800, margin: "12px 0", color: "#1A1A2E" }}>{fmt(payment.amount)}</div>
        <div style={{ fontSize: 12, color: "#94A3B8" }}>{payment.month} сарын төлбөр</div>
      </div>
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Төлбөрийн хэрэгсэл</div>
        {[
          { id: "qpay", label: "QPay", sub: "Бүх банк", logo: "https://play-lh.googleusercontent.com/0wTM8CGJF8FNlmOxEEO-qF_5SkjSKqfYHGq7E5KNsOkS8dFtFk_vF3m4B9pgPG6lg=w240-h480", color: "#E91E63" },
          { id: "socialpay", label: "SocialPay", sub: "Голомт банк", logo: "https://play-lh.googleusercontent.com/3LOqIGfGCfPSkFz97D8MILvFAjMPBaLYIxLAKBaERAQfPsOMm16TWKVmg3JvuElZRA=w240-h480", color: "#00BCD4" },
          { id: "khan", label: "Хаан банк", sub: "Шилжүүлэг", logo: "https://play-lh.googleusercontent.com/bG-Ox5Q8Nn9fHnDSd3v-2Kf-6JfwEjRuhqb3mlMN2sV4FDt8z_mYfVvRBH8r3MMVYA=w240-h480", color: "#00529B" },
          { id: "golomt", label: "Голомт банк", sub: "Шилжүүлэг", logo: "https://play-lh.googleusercontent.com/SuxYK5kQHgZBLJqBu4Z0bnPFpJSW0OaeYDp_PcasCUsG2R3a-TGD8sjPGPseu_dq6t4=w240-h480", color: "#003D7A" },
          { id: "tdb", label: "ХХБ", sub: "Шилжүүлэг", logo: "https://play-lh.googleusercontent.com/nUE8IHWL1GgCiR2hLscnWz3cd0fAFVLRHbDpGOTW5RA3APjS1TZ4J3L-3MhAfVJpJfc=w240-h480", color: "#ED1C24" },
          { id: "state", label: "Төрийн банк", sub: "Шилжүүлэг", logo: "https://play-lh.googleusercontent.com/FT5jfCDFHQW4_aFfOMro2yPx_mzOFq1fMI3CVB1qM0qK3DhIXPt7qyMC1EFPqRGQ3A=w240-h480", color: "#1B5E20" },
        ].map(m => (
          <label key={m.id} style={{
            display: "flex", alignItems: "center", gap: 12, padding: "12px 14px",
            borderRadius: 12, marginBottom: 8, cursor: "pointer",
            background: method === m.id ? `${m.color}08` : "#F8FAFC",
            border: method === m.id ? `2px solid ${m.color}` : "2px solid transparent",
            transition: "all 0.2s",
          }}>
            <input type="radio" checked={method === m.id} onChange={() => setMethod(m.id)} style={{ display: "none" }} />
            <img src={m.logo} alt={m.label} style={{ width: 36, height: 36, borderRadius: 10, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: 600, fontSize: 14 }}>{m.label}</div>
              <div style={{ fontSize: 11, color: "#94A3B8" }}>{m.sub}</div>
            </div>
            {method === m.id && <span style={{ color: m.color, fontWeight: 700, fontSize: 18 }}>●</span>}
          </label>
        ))}
      </div>
      <div style={{ padding: "0 16px" }}>
        <button onClick={handlePay} disabled={processing} style={{
          ...S.btn(processing ? "#94A3B8" : "#2563EB"),
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
        }}>
          {processing ? (
            <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>⏳</span> Боловсруулж байна...</>
          ) : (
            <>Төлөх — {fmt(payment.amount)}</>
          )}
        </button>
      </div>
    </div>
  );
}

function RequestsScreen({ requests, goTo }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => goTo("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Гомдол / Хүсэлт</div>
        </div>
      </div>
      <div style={{ padding: 16 }}>
        <button onClick={() => goTo("newRequest")} style={{ ...S.btn(), marginBottom: 16 }}>+ Шинэ хүсэлт</button>
        {requests.filter(r => r.unit === 45).map(r => {
          const st = STATUS_MAP[r.status];
          return (
            <div key={r.id} style={{ ...S.card, margin: "0 0 10px", padding: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <div style={{ fontWeight: 700, fontSize: 14 }}>{r.title}</div>
                  <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{r.desc}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>{r.date}</div>
                </div>
                <span style={S.badge(st.color, st.bg)}>{st.label}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function NewRequestScreen({ onSubmit, goTo }) {
  const [cat, setCat] = useState("");
  const [desc, setDesc] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = () => {
    if (!cat || !desc.trim()) return;
    onSubmit({ cat, desc });
    setSubmitted(true);
  };

  if (submitted) return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ fontSize: 18, fontWeight: 700 }}>Шинэ хүсэлт</div>
      </div>
      <div style={{ textAlign: "center", padding: "60px 32px" }}>
        <div style={{ fontSize: 52, marginBottom: 16 }}>✅</div>
        <div style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>Амжилттай илгээлээ!</div>
        <div style={{ fontSize: 14, color: "#64748B", marginBottom: 24 }}>Таны хүсэлтийг хүлээн авлаа</div>
        <button onClick={() => goTo("requests")} style={S.btn()}>Хүсэлтүүд харах</button>
      </div>
    </div>
  );

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => goTo("requests")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Шинэ хүсэлт</div>
        </div>
      </div>
      <div style={{ ...S.card, marginTop: 16 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Ангилал</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          {["Лифт", "Ус", "Цэвэрлэгээ", "Бусад"].map(c => (
            <button key={c} onClick={() => setCat(c)} style={{
              padding: "12px 16px", borderRadius: 12, border: cat === c ? "2px solid #2563EB" : "2px solid #E2E8F0",
              background: cat === c ? "#EFF6FF" : "#F8FAFC", cursor: "pointer",
              fontWeight: 600, fontSize: 13, color: cat === c ? "#2563EB" : "#64748B", transition: "all 0.2s",
            }}>{c}</button>
          ))}
        </div>
      </div>
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Тайлбар</div>
        <textarea value={desc} onChange={e => setDesc(e.target.value)} placeholder="Асуудлаа дэлгэрэнгүй бичнэ үү..." rows={4} style={{ ...S.input, resize: "vertical", fontFamily: "inherit" }} />
      </div>
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Зураг хавсаргах</div>
        <div style={{
          border: "2px dashed #E2E8F0", borderRadius: 12, padding: "24px 16px",
          textAlign: "center", color: "#94A3B8", cursor: "pointer",
        }}>
          📷 Зураг оруулах
        </div>
      </div>
      <div style={{ padding: "0 16px" }}>
        <button onClick={handleSubmit} style={S.btn(!cat || !desc.trim() ? "#94A3B8" : "#2563EB")}>Илгээх</button>
      </div>
    </div>
  );
}

/* ─── ХЭРЭГЛЭЭНИЙ ЗАРДАЛ (UTILITIES) ─── */
function UtilitiesScreen({ goTo, org }) {
  const accent = org?.color || "#2563EB";
  const [selectedUtil, setSelectedUtil] = useState(null);
  const [payingUtil, setPayingUtil] = useState(null);
  const [payMethod, setPayMethod] = useState("qpay");
  const [processing, setProcessing] = useState(false);

  const [utilities, setUtilities] = useState([
    {
      id: "electricity", name: "Цахилгаан", provider: "УБЦТС", icon: "⚡", color: "#F59E0B",
      account: "45-001234", balance: 12400, autoPayEnabled: true,
      history: [
        { month: "2026.03", amount: 45200, paid: false, kwh: 320, date: null },
        { month: "2026.02", amount: 38600, paid: true, kwh: 274, date: "2026.02.15" },
        { month: "2026.01", amount: 52100, paid: true, kwh: 370, date: "2026.01.18" },
        { month: "2025.12", amount: 48900, paid: true, kwh: 347, date: "2025.12.20" },
      ]
    },
    {
      id: "internet", name: "Интернет", provider: "Юнител", icon: "🌐", color: "#3B82F6",
      account: "UN-789456", balance: 0, autoPayEnabled: true,
      plan: "100Mbps Unlimited",
      history: [
        { month: "2026.03", amount: 45000, paid: true, date: "2026.03.01" },
        { month: "2026.02", amount: 45000, paid: true, date: "2026.02.01" },
        { month: "2026.01", amount: 45000, paid: true, date: "2026.01.01" },
      ]
    },
    {
      id: "sokh", name: "СӨХ төлбөр", provider: org?.name || "СӨХ", icon: "🏢", color: accent,
      account: "A-45", balance: 80000, autoPayEnabled: false,
      history: [
        { month: "2026.03", amount: 80000, paid: false, date: null },
        { month: "2026.02", amount: 80000, paid: true, date: "2026.02.10" },
        { month: "2026.01", amount: 80000, paid: true, date: "2026.01.15" },
      ]
    },
    {
      id: "heating", name: "Дулаан", provider: "ОСНААФК", icon: "🔥", color: "#EF4444",
      account: "DU-45-A", balance: 67800, autoPayEnabled: false,
      history: [
        { month: "2026.03", amount: 67800, paid: false, date: null },
        { month: "2026.02", amount: 72300, paid: true, date: "2026.02.12" },
        { month: "2026.01", amount: 85600, paid: true, date: "2026.01.14" },
      ]
    },
    {
      id: "water", name: "Ус, ариутгах", provider: "УСУГ", icon: "💧", color: "#0EA5E9",
      account: "US-45-001", balance: 15600, autoPayEnabled: false,
      history: [
        { month: "2026.03", amount: 15600, paid: false, date: null },
        { month: "2026.02", amount: 14200, paid: true, date: "2026.02.08" },
        { month: "2026.01", amount: 16800, paid: true, date: "2026.01.10" },
      ]
    },
    {
      id: "tv", name: "Кабелийн ТВ", provider: "Суперкабел", icon: "📺", color: "#8B5CF6",
      account: "TV-45678", balance: 0, autoPayEnabled: true,
      plan: "Premium 120 суваг",
      history: [
        { month: "2026.03", amount: 25000, paid: true, date: "2026.03.01" },
        { month: "2026.02", amount: 25000, paid: true, date: "2026.02.01" },
        { month: "2026.01", amount: 25000, paid: true, date: "2026.01.01" },
      ]
    },
  ]);

  const totalUnpaid = utilities.reduce((s, u) => s + u.balance, 0);
  const totalMonthly = utilities.reduce((s, u) => s + (u.history[0]?.amount || 0), 0);
  const paidCount = utilities.filter(u => u.balance === 0).length;

  const handlePay = (utilId) => {
    setProcessing(true);
    setTimeout(() => {
      setUtilities(prev => prev.map(u => {
        if (u.id !== utilId) return u;
        return {
          ...u, balance: 0,
          history: u.history.map((h, i) => i === 0 ? { ...h, paid: true, date: new Date().toISOString().slice(0, 10).replace(/-/g, ".") } : h)
        };
      }));
      setProcessing(false);
      setPayingUtil(null);
    }, 1500);
  };

  const handlePayAll = () => {
    setProcessing(true);
    setTimeout(() => {
      setUtilities(prev => prev.map(u => ({
        ...u, balance: 0,
        history: u.history.map((h, i) => i === 0 ? { ...h, paid: true, date: new Date().toISOString().slice(0, 10).replace(/-/g, ".") } : h)
      })));
      setProcessing(false);
    }, 2000);
  };

  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={{ ...S.header, background: `linear-gradient(135deg, #0F172A 0%, #1E293B 100%)`, paddingBottom: 24 }}>
        <div style={{ fontSize: 13, opacity: 0.6, color: "#94A3B8" }}>A блок, 45 тоот</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 4, color: "#fff" }}>Миний хэрэглээ</div>
        <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
          <div style={{ flex: 1, background: "rgba(239,68,68,0.15)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#FCA5A5" }}>Төлөх дүн</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#FCA5A5", marginTop: 2 }}>{fmt(totalUnpaid)}</div>
          </div>
          <div style={{ flex: 1, background: "rgba(34,197,94,0.15)", borderRadius: 12, padding: "12px 14px" }}>
            <div style={{ fontSize: 10, color: "#86EFAC" }}>Төлсөн</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: "#86EFAC", marginTop: 2 }}>{paidCount}/{utilities.length}</div>
          </div>
        </div>
        {totalUnpaid > 0 && (
          <button onClick={handlePayAll} disabled={processing} style={{
            ...S.btn("#22C55E"), marginTop: 14, fontSize: 14, padding: "14px 24px",
            display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          }}>
            {processing ? "⏳ Боловсруулж байна..." : `💳 Бүгдийг төлөх — ${fmt(totalUnpaid)}`}
          </button>
        )}
      </div>

      {/* Utilities List */}
      <div style={{ padding: "16px 16px 0" }}>
        {utilities.map(u => {
          const unpaid = u.balance > 0;
          const currentMonth = u.history[0];
          return (
            <div key={u.id} style={{
              ...S.card, margin: "0 0 10px", padding: 0, overflow: "hidden",
              border: unpaid ? `1px solid ${u.color}30` : "1px solid rgba(0,0,0,0.04)",
            }}>
              <div style={{ padding: 16, cursor: "pointer" }} onClick={() => setSelectedUtil(selectedUtil === u.id ? null : u.id)}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: `${u.color}15`, display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 22,
                  }}>{u.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                      <span style={{ fontWeight: 700, fontSize: 14 }}>{u.name}</span>
                      {u.autoPayEnabled && <span style={{ padding: "1px 6px", borderRadius: 4, fontSize: 9, fontWeight: 600, background: "#DCFCE7", color: "#166534" }}>AUTO</span>}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{u.provider} · {u.account}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    {unpaid ? (
                      <div style={{ fontSize: 16, fontWeight: 800, color: u.color }}>{fmt(u.balance)}</div>
                    ) : (
                      <div style={{ fontSize: 13, fontWeight: 700, color: "#22C55E" }}>✓ Төлсөн</div>
                    )}
                    <div style={{ fontSize: 10, color: "#CBD5E1" }}>{currentMonth?.month}</div>
                  </div>
                </div>
              </div>

              {/* Expanded detail */}
              {selectedUtil === u.id && (
                <div style={{ borderTop: "1px solid #F1F5F9", padding: 16, background: "#FAFBFC" }}>
                  {u.plan && (
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 10, padding: "6px 10px", background: `${u.color}08`, borderRadius: 8 }}>
                      <span style={{ fontSize: 11, color: u.color, fontWeight: 600 }}>📋 {u.plan}</span>
                    </div>
                  )}

                  {/* Monthly history */}
                  <div style={{ fontSize: 12, fontWeight: 700, marginBottom: 8 }}>Сарын түүх</div>
                  {u.history.map((h, i) => (
                    <div key={i} style={{ display: "flex", alignItems: "center", padding: "8px 0", borderBottom: i < u.history.length - 1 ? "1px solid #F1F5F9" : "none" }}>
                      <span style={{ fontSize: 12, color: "#64748B", width: 60 }}>{h.month}</span>
                      <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{fmt(h.amount)}</span>
                      {h.kwh && <span style={{ fontSize: 10, color: "#94A3B8", marginRight: 8 }}>{h.kwh} кВт</span>}
                      <span style={S.badge(h.paid ? "#22C55E" : "#EF4444", h.paid ? "#DCFCE7" : "#FEE2E2")}>
                        {h.paid ? `✓ ${h.date}` : "Төлөөгүй"}
                      </span>
                    </div>
                  ))}

                  {/* Pay button */}
                  {unpaid && (
                    <button onClick={() => setPayingUtil(u.id)} style={{ ...S.btn(u.color), marginTop: 12, fontSize: 13, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
                      💳 {fmt(u.balance)} төлөх
                    </button>
                  )}

                  {/* Auto-pay toggle */}
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 12, paddingTop: 12, borderTop: "1px solid #F1F5F9" }}>
                    <span style={{ fontSize: 12, fontWeight: 600, color: "#64748B" }}>🔄 Автомат төлөлт</span>
                    <button onClick={() => setUtilities(prev => prev.map(x => x.id === u.id ? { ...x, autoPayEnabled: !x.autoPayEnabled } : x))} style={{
                      width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                      background: u.autoPayEnabled ? "#22C55E" : "#D1D5DB", position: "relative", transition: "all 0.3s",
                    }}>
                      <div style={{ width: 18, height: 18, borderRadius: 9, background: "#fff", position: "absolute", top: 3, left: u.autoPayEnabled ? 23 : 3, transition: "all 0.3s", boxShadow: "0 1px 3px rgba(0,0,0,0.2)" }} />
                    </button>
                  </div>

                  {/* Provider contact */}
                  <div style={{ marginTop: 10, display: "flex", gap: 8 }}>
                    <button style={{ flex: 1, background: "#F1F5F9", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 11, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>📞 Лавлах</button>
                    <button style={{ flex: 1, background: "#F1F5F9", border: "none", borderRadius: 8, padding: "8px 0", fontSize: 11, fontWeight: 600, color: "#64748B", cursor: "pointer" }}>📝 Гомдол</button>
                  </div>
                </div>
              )}
            </div>
          );
        })}

        {/* Monthly summary */}
        <div style={{ ...S.card, background: "linear-gradient(135deg, #0F172A, #1E293B)", color: "#fff", marginTop: 8 }}>
          <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12, opacity: 0.7 }}>📊 Сарын нийт зардал</div>
          <div style={{ fontSize: 28, fontWeight: 900 }}>{fmt(totalMonthly)}</div>
          <div style={{ marginTop: 14 }}>
            {utilities.map(u => {
              const pct = Math.round(((u.history[0]?.amount || 0) / totalMonthly) * 100);
              return (
                <div key={u.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                  <span style={{ fontSize: 14 }}>{u.icon}</span>
                  <span style={{ flex: 1, fontSize: 11 }}>{u.name}</span>
                  <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: u.color, borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, minWidth: 55, textAlign: "right" }}>{fmt(u.history[0]?.amount || 0)}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {payingUtil && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setPayingUtil(null)}>
          <div style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 360, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
            {(() => {
              const u = utilities.find(x => x.id === payingUtil);
              if (!u) return null;
              return (
                <>
                  <div style={{ textAlign: "center", marginBottom: 20 }}>
                    <div style={{ fontSize: 36 }}>{u.icon}</div>
                    <div style={{ fontSize: 16, fontWeight: 700, marginTop: 8 }}>{u.name}</div>
                    <div style={{ fontSize: 12, color: "#94A3B8" }}>{u.provider}</div>
                    <div style={{ fontSize: 32, fontWeight: 900, color: u.color, marginTop: 8 }}>{fmt(u.balance)}</div>
                  </div>
                  <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Төлбөрийн хэрэгсэл</div>
                  {[
                    { id: "qpay", label: "QPay", sub: "Бүх банк", logo: "https://play-lh.googleusercontent.com/0wTM8CGJF8FNlmOxEEO-qF_5SkjSKqfYHGq7E5KNsOkS8dFtFk_vF3m4B9pgPG6lg=w240-h480", clr: "#E91E63" },
                    { id: "socialpay", label: "SocialPay", sub: "Голомт", logo: "https://play-lh.googleusercontent.com/3LOqIGfGCfPSkFz97D8MILvFAjMPBaLYIxLAKBaERAQfPsOMm16TWKVmg3JvuElZRA=w240-h480", clr: "#00BCD4" },
                    { id: "khan", label: "Хаан банк", sub: "", logo: "https://play-lh.googleusercontent.com/bG-Ox5Q8Nn9fHnDSd3v-2Kf-6JfwEjRuhqb3mlMN2sV4FDt8z_mYfVvRBH8r3MMVYA=w240-h480", clr: "#00529B" },
                    { id: "golomt", label: "Голомт", sub: "", logo: "https://play-lh.googleusercontent.com/SuxYK5kQHgZBLJqBu4Z0bnPFpJSW0OaeYDp_PcasCUsG2R3a-TGD8sjPGPseu_dq6t4=w240-h480", clr: "#003D7A" },
                  ].map(m => (
                    <label key={m.id} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 12px", borderRadius: 10, marginBottom: 6, cursor: "pointer",
                      background: payMethod === m.id ? `${m.clr}08` : "#F8FAFC",
                      border: payMethod === m.id ? `2px solid ${m.clr}` : "2px solid transparent",
                    }}>
                      <input type="radio" checked={payMethod === m.id} onChange={() => setPayMethod(m.id)} style={{ display: "none" }} />
                      <img src={m.logo} alt={m.label} style={{ width: 32, height: 32, borderRadius: 8, objectFit: "cover" }} onError={e => { e.target.style.display = "none"; }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 600, fontSize: 13 }}>{m.label}</div>
                        {m.sub && <div style={{ fontSize: 10, color: "#94A3B8" }}>{m.sub}</div>}
                      </div>
                      {payMethod === m.id && <span style={{ color: m.clr, fontWeight: 700 }}>●</span>}
                    </label>
                  ))}
                  <button onClick={() => handlePay(u.id)} disabled={processing} style={{ ...S.btn(processing ? "#94A3B8" : u.color), marginTop: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                    {processing ? "⏳ Боловсруулж байна..." : `Төлөх — ${fmt(u.balance)}`}
                  </button>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}

function MyUnitScreen({ goTo }) {
  return (
    <div style={{ paddingBottom: 80 }}>
      <div style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
          <button onClick={() => goTo("home")} style={{ background: "none", border: "none", color: "#fff", fontSize: 18, cursor: "pointer" }}>←</button>
          <div style={{ fontSize: 18, fontWeight: 700 }}>Миний мэдээлэл</div>
        </div>
      </div>
      <div style={{ ...S.card, marginTop: 16, textAlign: "center", background: "linear-gradient(135deg, #1E3A5F, #0F172A)", color: "#fff" }}>
        <div style={{ fontSize: 48, marginBottom: 8 }}>🏠</div>
        <div style={{ fontSize: 22, fontWeight: 800 }}>A блок, 45 тоот</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, padding: "0 16px" }}>
        {[
          { icon: "📐", label: "Талбай", value: "65 м²" },
          { icon: "👥", label: "Оршин суугч", value: "3 хүн" },
          { icon: "🏗️", label: "Давхар", value: "4-р давхар" },
          { icon: "🅿️", label: "Зогсоол", value: "#12" },
        ].map(i => (
          <div key={i.label} style={{ ...S.card, margin: 0, textAlign: "center" }}>
            <div style={{ fontSize: 24 }}>{i.icon}</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>{i.label}</div>
            <div style={{ fontSize: 16, fontWeight: 700, marginTop: 4 }}>{i.value}</div>
          </div>
        ))}
      </div>

      {/* Машины мэдээлэл */}
      <div style={{ padding: "12px 16px 0" }}>
        <div style={{ ...S.card, margin: 0, padding: 0, overflow: "hidden" }}>
          <div style={{ padding: "14px 16px", background: "#F8FAFC", borderBottom: "1px solid #F1F5F9" }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>🚗 Миний машин</div>
          </div>
          <div style={{ padding: 16 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{
                background: "#0F172A", borderRadius: 12, padding: "10px 16px",
                fontWeight: 900, fontSize: 18, fontFamily: "monospace", letterSpacing: 2,
                color: "#fff", border: "2px solid #334155",
              }}>
                УБА 1234
              </div>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>Toyota Prius</div>
                <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 2 }}>Цагаан · Зогсоол #12</div>
              </div>
            </div>
            <div style={{
              marginTop: 12, padding: "8px 12px", borderRadius: 8,
              background: "#DCFCE7", fontSize: 11, color: "#166534", fontWeight: 600,
            }}>
              ✓ Хаалтанд бүртгэлтэй — автомат нэвтэрнэ
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── RESIDENTS TAB ─── */
const INIT_RESIDENTS = [
  { id: 1, name: "Бат-Эрдэнэ", phone: "99112233", unit: 45, block: "A", type: "Owner", regNo: "УБ99112233", members: 3, moveIn: "2020.06", photo: null, car: "УБА 1234", parking: "#12" },
  { id: 2, name: "Сарангэрэл", phone: "88445566", unit: 46, block: "A", type: "Owner", regNo: "УБ88445566", members: 2, moveIn: "2021.01", photo: null, car: "УБЕ 5678", parking: "#13" },
  { id: 3, name: "Тэмүүлэн", phone: "95667788", unit: 47, block: "A", type: "Tenant", regNo: "ДО95667788", members: 4, moveIn: "2024.03", photo: null, car: "-", parking: "-" },
  { id: 4, name: "Мөнхбаяр", phone: "99887766", unit: 32, block: "B", type: "Owner", regNo: "УБ99887766", members: 2, moveIn: "2019.11", photo: null, car: "УБГ 9012", parking: "#08" },
  { id: 5, name: "Оюунчимэг", phone: "88991122", unit: 33, block: "B", type: "Tenant", regNo: "ХО88991122", members: 1, moveIn: "2025.08", photo: null, car: "-", parking: "#09" },
  { id: 6, name: "Ганбаатар", phone: "95443322", unit: 51, block: "A", type: "Owner", regNo: "УБ95443322", members: 3, moveIn: "2022.05", photo: null, car: "УБД 3456", parking: "#15" },
];

function ResidentsTab({ accent }) {
  const [residents, setResidents] = useState(INIT_RESIDENTS);
  const [showModal, setShowModal] = useState(false);
  const [editId, setEditId] = useState(null);
  const [search, setSearch] = useState("");
  const [filterBlock, setFilterBlock] = useState("all");
  const [viewResident, setViewResident] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importData, setImportData] = useState(null);
  const [importError, setImportError] = useState("");
  const [importMapping, setImportMapping] = useState({});
  const [importStep, setImportStep] = useState(1); // 1=upload, 2=map columns, 3=preview, 4=done
  const [xlsxLoaded, setXlsxLoaded] = useState(false);

  // Load SheetJS
  useEffect(() => {
    if (window.XLSX) { setXlsxLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setXlsxLoaded(true);
    document.head.appendChild(s);
  }, []);

  const FIELD_MAP = [
    { key: "name", label: "Овог нэр", required: true },
    { key: "phone", label: "Утас", required: true },
    { key: "unit", label: "Тоот", required: true },
    { key: "block", label: "Блок", required: false },
    { key: "type", label: "Төрөл (Owner/Tenant)", required: false },
    { key: "regNo", label: "Регистрийн дугаар", required: false },
    { key: "members", label: "Гишүүдийн тоо", required: false },
    { key: "moveIn", label: "Нүүж ирсэн огноо", required: false },
    { key: "car", label: "Машины дугаар", required: false },
    { key: "parking", label: "Зогсоолын дугаар", required: false },
    { key: "size", label: "Талбай (м²)", required: false },
    { key: "floor", label: "Давхар", required: false },
  ];

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");

    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = window.XLSX.read(ev.target.result, { type: "array" });
        const ws = wb.Sheets[wb.SheetNames[0]];
        const json = window.XLSX.utils.sheet_to_json(ws, { header: 1 });

        if (json.length < 2) {
          setImportError("Excel файл хоосон эсвэл толгой мөр дутуу байна");
          return;
        }

        const headers = json[0].map(h => String(h || "").trim());
        const rows = json.slice(1).filter(r => r.some(c => c !== null && c !== undefined && c !== ""));

        // Smart auto-map: analyze headers AND data
        const autoMap = {};
        const sampleRows = rows.slice(0, 10);
        headers.forEach((h, i) => {
          const hl = h.toLowerCase();
          const vals = sampleRows.map(r => r[i]).filter(v => v !== null && v !== undefined && v !== "");
          const isAllNumbers = vals.length > 0 && vals.every(v => !isNaN(Number(v)));
          const isSmallNumbers = isAllNumbers && vals.every(v => Number(v) <= 999);
          const hasPhone = vals.some(v => /^[0-9]{8,11}$/.test(String(v).replace(/[\s\-]/g, "")));
          const looksLikeBlock = vals.every(v => /^[A-Za-zА-Яа-я]{1,3}$/.test(String(v).trim()));
          const hasLetters = vals.some(v => /[а-яА-ЯёЁ]/.test(String(v)));
          const looksLikeReg = vals.some(v => /^[А-Яа-я]{2}\d{8}$/.test(String(v).replace(/\s/g, "")));
          const looksLikeDate = vals.some(v => /^\d{4}[\.\-\/]/.test(String(v)));
          const looksLikeCar = vals.some(v => /^[А-Яа-я]{2,3}\s?\d{3,4}$/.test(String(v).trim()));

          // Header matching (expanded keywords)
          if (hl.includes("нэр") || hl.includes("name") || hl.includes("овог") || hl.includes("оршин") || hl.includes("эзэмш") || hl.includes("owner")) { if (!autoMap.name) autoMap.name = i; }
          else if (hl.includes("утас") || hl.includes("phone") || hl.includes("холбоо") || hl.includes("mobile") || hl.includes("tel") || hasPhone) { if (!autoMap.phone) autoMap.phone = i; }
          else if (hl.includes("тоот") || hl.includes("unit") || hl.includes("room") || hl.includes("өрөө") || hl === "№" || hl === "#") { if (!autoMap.unit) autoMap.unit = i; }
          else if (hl.includes("блок") || hl.includes("block") || hl.includes("байр") || hl.includes("корпус") || (looksLikeBlock && !autoMap.block)) { if (!autoMap.block) autoMap.block = i; }
          else if (hl.includes("төрөл") || hl.includes("type") || hl.includes("эзэмш") || hl.includes("түрээс") || hl.includes("owner") || hl.includes("tenant")) { if (!autoMap.type) autoMap.type = i; }
          else if (hl.includes("регистр") || hl.includes("рд") || hl.includes("rd") || looksLikeReg) { if (!autoMap.regNo) autoMap.regNo = i; }
          else if (hl.includes("гишүүд") || hl.includes("хүн") || hl.includes("member") || hl.includes("тоо")) { if (!autoMap.members) autoMap.members = i; }
          else if (hl.includes("нүүж") || hl.includes("move") || hl.includes("огноо") || (looksLikeDate && !autoMap.moveIn)) { if (!autoMap.moveIn) autoMap.moveIn = i; }
          else if (hl.includes("машин") || hl.includes("car") || hl.includes("авто") || hl.includes("тээвэр") || looksLikeCar) { if (!autoMap.car) autoMap.car = i; }
          else if (hl.includes("зогсоол") || hl.includes("parking")) { if (!autoMap.parking) autoMap.parking = i; }
          else if (hl.includes("талбай") || hl.includes("size") || hl.includes("м²") || hl.includes("хэмжээ")) { if (!autoMap.size) autoMap.size = i; }
          else if (hl.includes("давхар") || hl.includes("floor")) { if (!autoMap.floor) autoMap.floor = i; }
        });

        // Smart fallback: if unit not found, find small number column
        if (autoMap.unit === undefined) {
          const idx = headers.findIndex((h, i) => {
            if (Object.values(autoMap).includes(i)) return false;
            const vals = sampleRows.map(r => r[i]).filter(v => v != null);
            return vals.length > 0 && vals.every(v => !isNaN(Number(v)) && Number(v) <= 999 && Number(v) > 0);
          });
          if (idx >= 0) autoMap.unit = idx;
        }
        // If name not found, find Mongolian text column
        if (autoMap.name === undefined) {
          const idx = headers.findIndex((h, i) => {
            if (Object.values(autoMap).includes(i)) return false;
            const vals = sampleRows.map(r => r[i]).filter(v => v != null);
            return vals.some(v => /[а-яА-ЯёЁ]{2,}/.test(String(v)));
          });
          if (idx >= 0) autoMap.name = idx;
        }

        setImportData({ headers, rows });
        setImportMapping(autoMap);
        setImportStep(2);
      } catch (err) {
        setImportError("Файл уншихад алдаа гарлаа: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const handleExcelDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;
    const fakeEvent = { target: { files: [file] } };
    handleExcelUpload(fakeEvent);
  };

  const getMappedPreview = () => {
    if (!importData) return [];
    return importData.rows.slice(0, 50).map((row, idx) => {
      const obj = { id: Date.now() + idx };
      FIELD_MAP.forEach(f => {
        const colIdx = importMapping[f.key];
        if (colIdx !== undefined && colIdx !== "" && colIdx !== -1) {
          let val = row[colIdx];
          if (val === undefined || val === null) val = "";
          if (f.key === "unit" || f.key === "members") val = Number(val) || 0;
          if (f.key === "type") {
            const v = String(val).toLowerCase();
            val = (v.includes("түрээс") || v.includes("tenant") || v.includes("rent")) ? "Tenant" : "Owner";
          }
          obj[f.key] = val;
        }
      });
      if (!obj.name) obj.name = "";
      if (!obj.phone) obj.phone = "";
      if (!obj.unit) obj.unit = 0;
      if (!obj.block) obj.block = "A";
      if (!obj.type) obj.type = "Owner";
      if (!obj.members) obj.members = 1;
      obj.photo = null;
      return obj;
    });
  };

  const handleImportConfirm = () => {
    const data = getMappedPreview().filter(r => r.name && r.unit);
    setResidents(prev => [...prev, ...data]);
    setImportStep(4);
  };

  const downloadTemplate = () => {
    if (!window.XLSX) return;
    const ws = window.XLSX.utils.aoa_to_sheet([
      ["Овог нэр", "Утас", "Тоот", "Блок", "Төрөл", "Регистрийн дугаар", "Гишүүдийн тоо", "Нүүж ирсэн", "Машины дугаар", "Зогсоол", "Талбай (м²)", "Давхар"],
      ["Бат-Эрдэнэ", "99112233", 45, "A", "Эзэмшигч", "УБ99112233", 3, "2020.06", "УБА 1234", "#12", 65, 4],
      ["Сарангэрэл", "88445566", 46, "A", "Эзэмшигч", "УБ88445566", 2, "2021.01", "УБЕ 5678", "#13", 70, 5],
      ["Тэмүүлэн", "95667788", 47, "A", "Түрээслэгч", "ДО95667788", 4, "2024.03", "-", "-", 60, 3],
    ]);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Оршин суугчид");
    // Set column widths
    ws["!cols"] = [{ wch: 16 }, { wch: 12 }, { wch: 6 }, { wch: 6 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 12 }, { wch: 14 }, { wch: 10 }, { wch: 10 }, { wch: 8 }];
    window.XLSX.writeFile(wb, "sokh_template.xlsx");
  };

  const exportResidents = () => {
    if (!window.XLSX) return;
    const data = residents.map(r => ({
      "Овог нэр": r.name,
      "Утас": r.phone,
      "Тоот": r.unit,
      "Блок": r.block,
      "Төрөл": r.type === "Owner" ? "Эзэмшигч" : "Түрээслэгч",
      "Регистрийн дугаар": r.regNo || "",
      "Гишүүдийн тоо": r.members,
      "Нүүж ирсэн": r.moveIn || "",
      "Машины дугаар": r.car || "",
      "Зогсоол": r.parking || "",
    }));
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Оршин суугчид");
    window.XLSX.writeFile(wb, `sokh_residents_${new Date().toISOString().slice(0,10)}.xlsx`);
  };

  // Form state
  const emptyForm = { name: "", phone: "", unit: "", block: "A", type: "Owner", regNo: "", members: 1, moveIn: "", photo: null, car: "", parking: "" };
  const [form, setForm] = useState(emptyForm);

  const openAdd = () => { setForm(emptyForm); setEditId(null); setShowModal(true); };
  const openEdit = (r) => { setForm({ ...r }); setEditId(r.id); setShowModal(true); };

  const handleSave = () => {
    if (!form.name.trim() || !form.phone.trim() || !form.unit) return;
    if (editId) {
      setResidents(prev => prev.map(r => r.id === editId ? { ...form, id: editId } : r));
    } else {
      setResidents(prev => [...prev, { ...form, id: Date.now(), unit: Number(form.unit) }]);
    }
    setShowModal(false);
    setEditId(null);
  };

  const handleDelete = (id) => {
    setResidents(prev => prev.filter(r => r.id !== id));
    setDeleteConfirm(null);
    setViewResident(null);
  };

  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(prev => ({ ...prev, photo: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const filtered = residents.filter(r => {
    const matchSearch = !search || r.name.toLowerCase().includes(search.toLowerCase()) || r.phone.includes(search) || String(r.unit).includes(search);
    const matchBlock = filterBlock === "all" || r.block === filterBlock;
    return matchSearch && matchBlock;
  });

  const totalResidents = residents.reduce((s, r) => s + (r.members || 1), 0);

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: accent }}>{residents.length}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Бүртгэл</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#22C55E" }}>{totalResidents}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Нийт хүн</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 22, fontWeight: 800, color: "#7C3AED" }}>{residents.filter(r => r.type === "Owner").length}/{residents.filter(r => r.type === "Tenant").length}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Эзэмшигч/Түрээс</div>
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ ...S.card, margin: "0 0 12px", padding: 14 }}>
        <div style={{ display: "flex", gap: 8 }}>
          <input
            value={search} onChange={e => setSearch(e.target.value)}
            placeholder="🔍 Нэр, утас, тоот хайх..."
            style={{ ...S.input, flex: 1 }}
          />
          <select value={filterBlock} onChange={e => setFilterBlock(e.target.value)} style={{ ...S.input, width: 90, padding: "10px 8px" }}>
            <option value="all">Бүгд</option>
            <option value="A">A блок</option>
            <option value="B">B блок</option>
          </select>
        </div>
      </div>

      {/* Add & Import Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={openAdd} style={{ ...S.btn(accent), flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, padding: "12px 10px" }}>
          ➕ Бүртгэх
        </button>
        <button onClick={() => { setShowImport(true); setImportStep(1); setImportData(null); setImportError(""); }} style={{ ...S.btn("#059669"), flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, padding: "12px 10px" }}>
          📥 Excel оруулах
        </button>
        <button onClick={exportResidents} style={{ ...S.btn("#7C3AED"), flex: 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6, fontSize: 12, padding: "12px 10px" }}>
          📤 Excel татах
        </button>
      </div>

      {/* Residents List */}
      {filtered.map(r => (
        <div key={r.id} style={{ ...S.card, margin: "0 0 10px", padding: 14, cursor: "pointer" }} onClick={() => setViewResident(r)}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {r.photo ? (
              <img src={r.photo} alt="" style={{ width: 44, height: 44, borderRadius: 12, objectFit: "cover" }} />
            ) : (
              <div style={{ width: 44, height: 44, borderRadius: 12, background: `${accent}15`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, color: accent, fontWeight: 700 }}>
                {r.name.charAt(0)}
              </div>
            )}
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontWeight: 700, fontSize: 14 }}>{r.name}</span>
                <span style={S.badge(r.type === "Owner" ? "#2563EB" : "#7C3AED", r.type === "Owner" ? "#EFF6FF" : "#F5F3FF")}>
                  {r.type === "Owner" ? "Эзэмшигч" : "Түрээслэгч"}
                </span>
              </div>
              <div style={{ fontSize: 12, color: "#64748B", marginTop: 3 }}>
                {r.block}-{r.unit} тоот · 📞 {r.phone} · 👥 {r.members} хүн
              </div>
            </div>
            <span style={{ color: "#CBD5E1", fontSize: 16 }}>›</span>
          </div>
        </div>
      ))}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>👥</div>
          <div style={{ fontSize: 14 }}>Илэрц олдсонгүй</div>
        </div>
      )}

      {/* View Resident Detail Modal */}
      {viewResident && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }} onClick={() => setViewResident(null)}>
          <div style={{
            background: "#fff", borderRadius: 20, maxWidth: 400, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, padding: 24, color: "#fff", textAlign: "center" }}>
              {viewResident.photo ? (
                <img src={viewResident.photo} alt="" style={{ width: 72, height: 72, borderRadius: 18, objectFit: "cover", border: "3px solid rgba(255,255,255,0.3)", margin: "0 auto 12px" }} />
              ) : (
                <div style={{ width: 72, height: 72, borderRadius: 18, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 28, fontWeight: 700, margin: "0 auto 12px" }}>
                  {viewResident.name.charAt(0)}
                </div>
              )}
              <div style={{ fontSize: 20, fontWeight: 800 }}>{viewResident.name}</div>
              <div style={{ fontSize: 12, opacity: 0.8, marginTop: 4 }}>{viewResident.block}-{viewResident.unit} тоот</div>
            </div>

            {/* Info */}
            <div style={{ padding: 20 }}>
              {[
                { icon: "📞", label: "Утас", value: viewResident.phone },
                { icon: "🪪", label: "Регистрийн дугаар", value: viewResident.regNo || "-" },
                { icon: "🏠", label: "Төрөл", value: viewResident.type === "Owner" ? "Эзэмшигч" : "Түрээслэгч" },
                { icon: "👥", label: "Гэр бүлийн гишүүд", value: `${viewResident.members} хүн` },
                { icon: "📅", label: "Нүүж ирсэн", value: viewResident.moveIn || "-" },
                { icon: "🚗", label: "Машины дугаар", value: viewResident.car || "-" },
                { icon: "🅿️", label: "Зогсоолын дугаар", value: viewResident.parking || "-" },
              ].map(i => (
                <div key={i.label} style={{ display: "flex", alignItems: "center", padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                  <span style={{ fontSize: 16, width: 30 }}>{i.icon}</span>
                  <span style={{ flex: 1, fontSize: 12, color: "#94A3B8" }}>{i.label}</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{i.value}</span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
              <button onClick={() => { setViewResident(null); openEdit(viewResident); }} style={{ ...S.btn(accent), flex: 1, fontSize: 13 }}>
                ✏️ Засах
              </button>
              <button onClick={() => setDeleteConfirm(viewResident.id)} style={{ ...S.btn("#EF4444"), flex: 1, fontSize: 13 }}>
                🗑️ Устгах
              </button>
            </div>

            {deleteConfirm === viewResident.id && (
              <div style={{ padding: "0 20px 20px" }}>
                <div style={{ background: "#FEF2F2", borderRadius: 12, padding: 14, textAlign: "center" }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: "#991B1B", marginBottom: 10 }}>Устгахдаа итгэлтэй байна уу?</div>
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => setDeleteConfirm(null)} style={{ ...S.btnOutline, flex: 1, fontSize: 12, padding: "8px 12px" }}>Болих</button>
                    <button onClick={() => handleDelete(viewResident.id)} style={{ ...S.btn("#EF4444"), flex: 1, fontSize: 12, padding: "8px 12px" }}>Тийм, устга</button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Add/Edit Modal */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }} onClick={() => setShowModal(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24, maxWidth: 400, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 20 }}>
              {editId ? "✏️ Оршин суугч засах" : "➕ Шинэ оршин суугч"}
            </div>

            {/* Photo */}
            <div style={{ textAlign: "center", marginBottom: 16 }}>
              <div
                onClick={() => document.getElementById("resident-photo").click()}
                style={{
                  width: 72, height: 72, borderRadius: 18, margin: "0 auto", cursor: "pointer",
                  background: form.photo ? "transparent" : `${accent}10`,
                  display: "flex", alignItems: "center", justifyContent: "center",
                  border: `2px dashed ${accent}40`, overflow: "hidden",
                }}
              >
                {form.photo ? (
                  <img src={form.photo} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
                ) : (
                  <span style={{ fontSize: 24 }}>📷</span>
                )}
              </div>
              <input id="resident-photo" type="file" accept="image/*" onChange={handlePhotoUpload} style={{ display: "none" }} />
              <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>Зураг оруулах</div>
            </div>

            {/* Name */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Овог нэр *</div>
              <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} placeholder="Жишээ: Бат-Эрдэнэ" style={S.input} />
            </div>

            {/* Phone */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Утасны дугаар *</div>
              <input value={form.phone} onChange={e => setForm(p => ({ ...p, phone: e.target.value }))} placeholder="99112233" style={S.input} />
            </div>

            {/* RegNo */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Регистрийн дугаар</div>
              <input value={form.regNo} onChange={e => setForm(p => ({ ...p, regNo: e.target.value }))} placeholder="УБ99112233" style={S.input} />
            </div>

            {/* Block & Unit */}
            <div style={{ display: "flex", gap: 10, marginBottom: 12 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Блок *</div>
                <select value={form.block} onChange={e => setForm(p => ({ ...p, block: e.target.value }))} style={S.input}>
                  <option value="A">A блок</option>
                  <option value="B">B блок</option>
                </select>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Тоот *</div>
                <input value={form.unit} onChange={e => setForm(p => ({ ...p, unit: e.target.value }))} placeholder="45" type="number" style={S.input} />
              </div>
            </div>

            {/* Type */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Төрөл</div>
              <div style={{ display: "flex", gap: 8 }}>
                {[{ id: "Owner", label: "🏠 Эзэмшигч" }, { id: "Tenant", label: "🔑 Түрээслэгч" }].map(t => (
                  <button key={t.id} onClick={() => setForm(p => ({ ...p, type: t.id }))} style={{
                    flex: 1, padding: "10px 12px", borderRadius: 10,
                    border: form.type === t.id ? `2px solid ${accent}` : "2px solid #E2E8F0",
                    background: form.type === t.id ? `${accent}10` : "#F8FAFC",
                    cursor: "pointer", fontSize: 12, fontWeight: 600,
                    color: form.type === t.id ? accent : "#64748B",
                  }}>{t.label}</button>
                ))}
              </div>
            </div>

            {/* Members */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Гэр бүлийн гишүүд</div>
              <input value={form.members} onChange={e => setForm(p => ({ ...p, members: Number(e.target.value) }))} type="number" min={1} style={S.input} />
            </div>

            {/* Move-in date */}
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Нүүж ирсэн огноо</div>
              <input value={form.moveIn} onChange={e => setForm(p => ({ ...p, moveIn: e.target.value }))} placeholder="2024.01" style={S.input} />
            </div>

            {/* Car & Parking */}
            <div style={{ display: "flex", gap: 10, marginBottom: 16 }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Машины дугаар</div>
                <input value={form.car} onChange={e => setForm(p => ({ ...p, car: e.target.value }))} placeholder="УБА 1234" style={S.input} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 4, color: "#374151" }}>Зогсоол</div>
                <input value={form.parking} onChange={e => setForm(p => ({ ...p, parking: e.target.value }))} placeholder="#12" style={S.input} />
              </div>
            </div>

            {/* Buttons */}
            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowModal(false)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Болих</button>
              <button onClick={handleSave} style={{ ...S.btn(accent), flex: 1 }}>
                {editId ? "Хадгалах" : "Бүртгэх"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {showImport && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 16,
        }} onClick={() => setShowImport(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24, maxWidth: 480, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>

            {/* Step indicator */}
            <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 20 }}>
              {[1, 2, 3, 4].map(s => (
                <div key={s} style={{ display: "flex", alignItems: "center", gap: 6, flex: s < 4 ? 1 : "none" }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 14, display: "flex", alignItems: "center", justifyContent: "center",
                    background: importStep >= s ? accent : "#E2E8F0", color: importStep >= s ? "#fff" : "#94A3B8",
                    fontSize: 12, fontWeight: 700, transition: "all 0.3s",
                  }}>{s === 4 ? "✓" : s}</div>
                  {s < 4 && <div style={{ flex: 1, height: 2, background: importStep > s ? accent : "#E2E8F0", transition: "all 0.3s" }} />}
                </div>
              ))}
            </div>

            {/* Step 1: Upload */}
            {importStep === 1 && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>📥 Excel файл оруулах</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Оршин суугчдийн мэдээллийг Excel файлаас татаж оруулна</div>

                <div
                  onDragOver={e => e.preventDefault()}
                  onDrop={handleExcelDrop}
                  onClick={() => document.getElementById("excel-input").click()}
                  style={{
                    border: "2px dashed #CBD5E1", borderRadius: 16, padding: 32,
                    textAlign: "center", cursor: "pointer", background: "#FAFBFC",
                    transition: "all 0.2s", marginBottom: 16,
                  }}
                >
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Excel файл сонгох</div>
                  <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Дарах эсвэл файл чирж оруулах</div>
                  <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>.xlsx, .xls, .csv</div>
                  <input id="excel-input" type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} style={{ display: "none" }} />
                </div>

                {importError && (
                  <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12, color: "#991B1B" }}>
                    ⚠️ {importError}
                  </div>
                )}

                <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 8 }}>💡 Excel файлын загвар</div>
                  <div style={{ fontSize: 11, color: "#166534", lineHeight: 1.6 }}>
                    Дараах баганууд байх шаардлагатай: <strong>Овог нэр, Утас, Тоот</strong> (заавал).
                    Нэмэлт: Блок, Төрөл, Регистрийн дугаар, Гишүүдийн тоо, Нүүж ирсэн, Машины дугаар, Зогсоол, Талбай, Давхар.
                  </div>
                  <button onClick={downloadTemplate} style={{
                    marginTop: 10, background: "#22C55E", color: "#fff", border: "none", borderRadius: 8,
                    padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                    display: "flex", alignItems: "center", gap: 6,
                  }}>
                    📥 Загвар файл татах (Excel)
                  </button>
                </div>

                <button onClick={() => setShowImport(false)} style={{ ...S.btnOutline, width: "100%", borderRadius: 12 }}>Болих</button>
              </div>
            )}

            {/* Step 2: Map Columns */}
            {importStep === 2 && importData && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>🔗 Баганууд тохируулах</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 4 }}>
                  {importData.rows.length} мөр олдлоо. Багана бүрийг зөв талбартай холбоно уу.
                </div>
                <div style={{
                  background: `${accent}08`, borderRadius: 10, padding: 10, marginBottom: 14,
                  fontSize: 11, color: accent,
                }}>
                  ✨ Автоматаар таарсан баганууд тодоор харагдана
                </div>

                <div style={{ maxHeight: 340, overflowY: "auto" }}>
                  {FIELD_MAP.map(f => (
                    <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                      <div style={{ flex: 1 }}>
                        <span style={{ fontSize: 12, fontWeight: 600 }}>{f.label}</span>
                        {f.required && <span style={{ color: "#EF4444", marginLeft: 4 }}>*</span>}
                      </div>
                      <select
                        value={importMapping[f.key] !== undefined ? importMapping[f.key] : ""}
                        onChange={e => setImportMapping(prev => ({ ...prev, [f.key]: e.target.value === "" ? undefined : Number(e.target.value) }))}
                        style={{
                          ...S.input, width: 160, padding: "6px 8px", fontSize: 12,
                          borderColor: importMapping[f.key] !== undefined ? accent : "#E2E8F0",
                          fontWeight: importMapping[f.key] !== undefined ? 600 : 400,
                        }}
                      >
                        <option value="">-- Сонгоогүй --</option>
                        {importData.headers.map((h, i) => (
                          <option key={i} value={i}>{h}</option>
                        ))}
                      </select>
                    </div>
                  ))}
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => setImportStep(1)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>← Буцах</button>
                  <button
                    onClick={() => {
                      if (importMapping.name === undefined || importMapping.phone === undefined || importMapping.unit === undefined) {
                        setImportError("Овог нэр, Утас, Тоот баганыг заавал сонгоно уу");
                        return;
                      }
                      setImportError("");
                      setImportStep(3);
                    }}
                    style={{ ...S.btn(accent), flex: 1 }}
                  >
                    Урьдчилан харах →
                  </button>
                </div>
                {importError && (
                  <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 10, marginTop: 10, fontSize: 12, color: "#991B1B" }}>
                    ⚠️ {importError}
                  </div>
                )}
              </div>
            )}

            {/* Step 3: Preview */}
            {importStep === 3 && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>👀 Урьдчилан харах</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 14 }}>
                  {getMappedPreview().filter(r => r.name && r.unit).length} оршин суугч оруулахад бэлэн
                </div>

                <div style={{ maxHeight: 320, overflowY: "auto", borderRadius: 12, border: "1px solid #F1F5F9" }}>
                  <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 11 }}>
                    <thead>
                      <tr style={{ background: "#F8FAFC", position: "sticky", top: 0 }}>
                        {["Нэр", "Утас", "Тоот", "Блок", "Төрөл", "Гишүүд"].map(h => (
                          <th key={h} style={{ padding: "8px 10px", textAlign: "left", fontWeight: 700, color: "#64748B", fontSize: 10 }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {getMappedPreview().map((r, i) => (
                        <tr key={i} style={{ borderBottom: "1px solid #F8FAFC", background: (!r.name || !r.unit) ? "#FEF2F2" : "transparent" }}>
                          <td style={{ padding: "8px 10px", fontWeight: 600 }}>{r.name || <span style={{ color: "#EF4444" }}>—</span>}</td>
                          <td style={{ padding: "8px 10px" }}>{r.phone}</td>
                          <td style={{ padding: "8px 10px" }}>{r.unit || <span style={{ color: "#EF4444" }}>—</span>}</td>
                          <td style={{ padding: "8px 10px" }}>{r.block}</td>
                          <td style={{ padding: "8px 10px" }}>
                            <span style={S.badge(r.type === "Owner" ? "#2563EB" : "#7C3AED", r.type === "Owner" ? "#EFF6FF" : "#F5F3FF")}>
                              {r.type === "Owner" ? "Эзэмш" : "Түрээс"}
                            </span>
                          </td>
                          <td style={{ padding: "8px 10px" }}>{r.members}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => setImportStep(2)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>← Буцах</button>
                  <button onClick={handleImportConfirm} style={{ ...S.btn("#22C55E"), flex: 1 }}>
                    ✓ {getMappedPreview().filter(r => r.name && r.unit).length} оршин суугч оруулах
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Done */}
            {importStep === 4 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Амжилттай!</div>
                <div style={{ fontSize: 14, color: "#64748B", marginBottom: 20 }}>
                  Оршин суугчдийн мэдээлэл амжилттай оруулагдлаа
                </div>
                <button onClick={() => setShowImport(false)} style={{ ...S.btn(accent), width: "100%" }}>Хаах</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ХАР ДЭВТЭР (LEDGER) ─── */
const INIT_LEDGER = [
  { id: 1, unit: 45, block: "A", name: "Бат-Эрдэнэ", months: [
    { month: "2026.01", amount: 80000, paid: 80000, date: "2026.01.15" },
    { month: "2026.02", amount: 80000, paid: 80000, date: "2026.02.10" },
    { month: "2026.03", amount: 80000, paid: 0, date: null },
  ]},
  { id: 2, unit: 46, block: "A", name: "Сарангэрэл", months: [
    { month: "2026.01", amount: 80000, paid: 80000, date: "2026.01.20" },
    { month: "2026.02", amount: 80000, paid: 0, date: null },
    { month: "2026.03", amount: 80000, paid: 0, date: null },
  ]},
  { id: 3, unit: 47, block: "A", name: "Тэмүүлэн", months: [
    { month: "2026.01", amount: 80000, paid: 80000, date: "2026.01.05" },
    { month: "2026.02", amount: 80000, paid: 80000, date: "2026.02.08" },
    { month: "2026.03", amount: 80000, paid: 80000, date: "2026.03.02" },
  ]},
  { id: 4, unit: 32, block: "B", name: "Мөнхбаяр", months: [
    { month: "2026.01", amount: 80000, paid: 0, date: null },
    { month: "2026.02", amount: 80000, paid: 0, date: null },
    { month: "2026.03", amount: 80000, paid: 0, date: null },
  ]},
  { id: 5, unit: 33, block: "B", name: "Оюунчимэг", months: [
    { month: "2026.01", amount: 80000, paid: 80000, date: "2026.01.12" },
    { month: "2026.02", amount: 80000, paid: 80000, date: "2026.02.15" },
    { month: "2026.03", amount: 80000, paid: 0, date: null },
  ]},
  { id: 6, unit: 51, block: "A", name: "Ганбаатар", months: [
    { month: "2026.01", amount: 80000, paid: 80000, date: "2026.01.25" },
    { month: "2026.02", amount: 80000, paid: 40000, date: "2026.02.20" },
    { month: "2026.03", amount: 80000, paid: 0, date: null },
  ]},
];

function LedgerTab({ accent, org }) {
  const [ledger, setLedger] = useState(INIT_LEDGER);
  const [filterBlock, setFilterBlock] = useState("all");
  const [filterStatus, setFilterStatus] = useState("all"); // all, debt, paid
  const [search, setSearch] = useState("");
  const [viewUnit, setViewUnit] = useState(null);
  const [showImport, setShowImport] = useState(false);
  const [importStep, setImportStep] = useState(1);
  const [importData, setImportData] = useState(null);
  const [importMapping, setImportMapping] = useState({});
  const [importError, setImportError] = useState("");
  const [xlsxLoaded, setXlsxLoaded] = useState(false);

  useEffect(() => {
    if (window.XLSX) { setXlsxLoaded(true); return; }
    const s = document.createElement("script");
    s.src = "https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js";
    s.onload = () => setXlsxLoaded(true);
    document.head.appendChild(s);
  }, []);

  const getDebt = (entry) => entry.months.reduce((s, m) => s + (m.amount - m.paid), 0);
  const getTotalPaid = (entry) => entry.months.reduce((s, m) => s + m.paid, 0);
  const getTotalAmount = (entry) => entry.months.reduce((s, m) => s + m.amount, 0);

  const filtered = ledger.filter(e => {
    const matchBlock = filterBlock === "all" || e.block === filterBlock;
    const matchSearch = !search || e.name.toLowerCase().includes(search.toLowerCase()) || String(e.unit).includes(search);
    const debt = getDebt(e);
    const matchStatus = filterStatus === "all" || (filterStatus === "debt" && debt > 0) || (filterStatus === "paid" && debt === 0);
    return matchBlock && matchSearch && matchStatus;
  });

  const totalDebt = ledger.reduce((s, e) => s + getDebt(e), 0);
  const totalPaid = ledger.reduce((s, e) => s + getTotalPaid(e), 0);
  const debtCount = ledger.filter(e => getDebt(e) > 0).length;

  // Excel import
  const LEDGER_FIELDS = [
    { key: "unit", label: "Тоот", required: true },
    { key: "block", label: "Блок", required: false },
    { key: "name", label: "Нэр", required: false },
    { key: "month", label: "Сар (2026.01)", required: true },
    { key: "amount", label: "Нэхэмжлэх дүн", required: true },
    { key: "paid", label: "Төлсөн дүн", required: true },
    { key: "date", label: "Төлсөн огноо", required: false },
  ];

  // Smart column detection: analyzes both headers AND data content
  const smartDetectColumns = (headers, rows) => {
    const autoMap = {};
    const sampleRows = rows.slice(0, 10);

    // Analyze each column's data to guess its type
    const colAnalysis = headers.map((h, i) => {
      const vals = sampleRows.map(r => r[i]).filter(v => v !== null && v !== undefined && v !== "");
      const hl = String(h || "").toLowerCase();

      const isAllNumbers = vals.length > 0 && vals.every(v => !isNaN(Number(v)));
      const isSmallNumbers = isAllNumbers && vals.every(v => Number(v) <= 999);
      const isLargeNumbers = isAllNumbers && vals.some(v => Number(v) >= 1000);
      const hasLetters = vals.some(v => /[а-яА-ЯёЁa-zA-Z]/.test(String(v)));
      const looksLikeMonth = vals.some(v => /^\d{4}[\.\-\/]\d{1,2}$/.test(String(v)));
      const looksLikeDate = vals.some(v => /^\d{4}[\.\-\/]\d{1,2}[\.\-\/]\d{1,2}$/.test(String(v)));
      const looksLikeBlock = vals.every(v => /^[A-Za-zА-Яа-я]{1,3}$/.test(String(v).trim()));
      const isVerySmall = isAllNumbers && vals.every(v => Number(v) <= 200);

      return { idx: i, header: h, hl, vals, isAllNumbers, isSmallNumbers, isLargeNumbers, hasLetters, looksLikeMonth, looksLikeDate, looksLikeBlock, isVerySmall };
    });

    // 1. Header name matching (original logic, expanded)
    colAnalysis.forEach(c => {
      const h = c.hl;
      // Тоот
      if (h.includes("тоот") || h.includes("unit") || h.includes("өрөө") || h.includes("room") || h === "№" || h === "no" || h === "#") {
        if (!autoMap.unit) autoMap.unit = c.idx;
      }
      // Блок
      else if (h.includes("блок") || h.includes("block") || h.includes("байр") || h.includes("корпус") || h.includes("building")) {
        if (!autoMap.block) autoMap.block = c.idx;
      }
      // Нэр
      else if (h.includes("нэр") || h.includes("name") || h.includes("овог") || h.includes("owner") || h.includes("эзэмш") || h.includes("оршин")) {
        if (!autoMap.name) autoMap.name = c.idx;
      }
      // Сар
      else if (h.includes("сар") || h.includes("month") || h.includes("хугацаа") || h.includes("period")) {
        if (!autoMap.month) autoMap.month = c.idx;
      }
      // Нэхэмжлэх
      else if (h.includes("нэхэмжл") || h.includes("amount") || h.includes("төлбөр") || h.includes("charge") || h.includes("дүн") || h.includes("нийт")) {
        if (!autoMap.amount) autoMap.amount = c.idx;
      }
      // Төлсөн дүн
      else if ((h.includes("төлсөн") || h.includes("paid") || h.includes("орлого")) && !h.includes("огноо") && !h.includes("date")) {
        if (!autoMap.paid) autoMap.paid = c.idx;
      }
      // Төлсөн огноо
      else if ((h.includes("төлсөн") && h.includes("огноо")) || (h.includes("paid") && h.includes("date")) || h.includes("payment date")) {
        if (!autoMap.date) autoMap.date = c.idx;
      }
      // Өр, үлдэгдэл, авлага
      else if (h.includes("өр") || h.includes("үлдэгдэл") || h.includes("авлага") || h.includes("debt") || h.includes("balance") || h.includes("remain")) {
        // Skip — we calculate debt ourselves
      }
    });

    // 2. Smart data-based detection for unmapped fields
    const mapped = new Set(Object.values(autoMap));
    const unmapped = colAnalysis.filter(c => !mapped.has(c.idx));

    // If unit not found, look for small number column (1-999)
    if (autoMap.unit === undefined) {
      const candidate = unmapped.find(c => c.isVerySmall && c.isAllNumbers);
      if (candidate) { autoMap.unit = candidate.idx; mapped.add(candidate.idx); }
    }

    // If block not found, look for single-letter column
    if (autoMap.block === undefined) {
      const candidate = unmapped.find(c => c.looksLikeBlock && !mapped.has(c.idx));
      if (candidate) { autoMap.block = candidate.idx; mapped.add(candidate.idx); }
    }

    // If month not found, look for date-like column (2026.01 format)
    if (autoMap.month === undefined) {
      const candidate = unmapped.find(c => c.looksLikeMonth && !mapped.has(c.idx));
      if (candidate) { autoMap.month = candidate.idx; mapped.add(candidate.idx); }
    }

    // If name not found, look for text column with names
    if (autoMap.name === undefined) {
      const candidate = unmapped.find(c => c.hasLetters && !c.looksLikeBlock && !c.looksLikeMonth && !mapped.has(c.idx));
      if (candidate) { autoMap.name = candidate.idx; mapped.add(candidate.idx); }
    }

    // For amount and paid: look for large number columns
    const largeNumCols = unmapped.filter(c => c.isLargeNumbers && !mapped.has(c.idx));
    if (autoMap.amount === undefined && largeNumCols.length >= 1) {
      autoMap.amount = largeNumCols[0].idx;
      mapped.add(largeNumCols[0].idx);
    }
    if (autoMap.paid === undefined && largeNumCols.length >= 2) {
      autoMap.paid = largeNumCols[1].idx;
      mapped.add(largeNumCols[1].idx);
    }
    // If only one large number column and paid still missing, check for another number col
    if (autoMap.paid === undefined) {
      const remaining = unmapped.filter(c => c.isAllNumbers && !mapped.has(c.idx));
      if (remaining.length > 0) { autoMap.paid = remaining[0].idx; mapped.add(remaining[0].idx); }
    }

    // Date detection
    if (autoMap.date === undefined) {
      const candidate = unmapped.find(c => c.looksLikeDate && !mapped.has(c.idx));
      if (candidate) { autoMap.date = candidate.idx; }
    }

    return autoMap;
  };

  const handleExcelUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError("");
    const reader = new FileReader();
    reader.onload = (ev) => {
      try {
        const wb = window.XLSX.read(ev.target.result, { type: "array" });
        const sheetNames = wb.SheetNames;

        if (sheetNames.length === 0) { setImportError("Файл хоосон байна"); return; }

        // Read ALL sheets and combine
        let allHeaders = null;
        let allRows = [];
        const sheetInfo = [];

        sheetNames.forEach((name, sheetIdx) => {
          const ws = wb.Sheets[name];
          const json = window.XLSX.utils.sheet_to_json(ws, { header: 1 });
          if (json.length < 2) { sheetInfo.push({ name, rows: 0, status: "хоосон" }); return; }

          // Find header row (skip empty rows)
          let headerIdx = 0;
          for (let i = 0; i < Math.min(json.length, 8); i++) {
            const row = json[i];
            if (row && row.filter(c => c !== null && c !== undefined && c !== "").length >= 2) {
              headerIdx = i;
              break;
            }
          }

          const headers = json[headerIdx].map(h => String(h || "").trim());
          const rows = json.slice(headerIdx + 1).filter(r => r.some(c => c !== null && c !== undefined && c !== ""));

          // Use first valid sheet's headers as reference
          if (!allHeaders && headers.length > 0) {
            allHeaders = headers;
          }

          // If this sheet has same or similar headers, add rows directly
          // If different structure, try to remap columns to match first sheet
          if (allHeaders) {
            if (headers.length === allHeaders.length || headersMatch(allHeaders, headers)) {
              allRows = allRows.concat(rows);
            } else {
              // Different structure — try to remap
              const remapped = remapRows(allHeaders, headers, rows);
              allRows = allRows.concat(remapped);
            }
          }

          sheetInfo.push({ name, rows: rows.length, status: "✓" });
        });

        if (!allHeaders || allRows.length === 0) {
          setImportError("Бүх хуудас хоосон байна");
          return;
        }

        // Smart auto-map
        const autoMap = smartDetectColumns(allHeaders, allRows);

        setImportData({ headers: allHeaders, rows: allRows, sheetInfo, totalSheets: sheetNames.length });
        setImportMapping(autoMap);
        setImportStep(2);
      } catch (err) {
        setImportError("Файл уншихад алдаа: " + err.message);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Check if two header rows are similar enough
  const headersMatch = (h1, h2) => {
    if (h1.length !== h2.length) return false;
    let matchCount = 0;
    h1.forEach((a, i) => {
      if (a.toLowerCase() === (h2[i] || "").toLowerCase()) matchCount++;
    });
    return matchCount >= h1.length * 0.5;
  };

  // Remap rows from one column structure to another
  const remapRows = (targetHeaders, sourceHeaders, rows) => {
    // Build mapping: target col index -> source col index
    const colMap = {};
    targetHeaders.forEach((th, ti) => {
      const tl = th.toLowerCase();
      // Try exact match first
      let found = sourceHeaders.findIndex(sh => sh.toLowerCase() === tl);
      // Try partial match
      if (found < 0) {
        found = sourceHeaders.findIndex(sh => {
          const sl = sh.toLowerCase();
          return (tl.includes(sl) || sl.includes(tl)) && sl.length > 0 && tl.length > 0;
        });
      }
      if (found >= 0) colMap[ti] = found;
    });

    return rows.map(row => {
      const newRow = [];
      targetHeaders.forEach((_, ti) => {
        newRow[ti] = colMap[ti] !== undefined ? row[colMap[ti]] : null;
      });
      return newRow;
    });
  };

  const handleImportConfirm = () => {
    if (!importData) return;
    const newLedger = {};

    importData.rows.forEach(row => {
      const unit = Number(row[importMapping.unit]) || 0;
      if (!unit) return;
      const block = importMapping.block !== undefined ? String(row[importMapping.block] || "A").trim() : "A";
      const name = importMapping.name !== undefined ? String(row[importMapping.name] || "").trim() : "";
      const month = importMapping.month !== undefined ? String(row[importMapping.month] || "").trim() : "2026.03";
      const amount = Number(row[importMapping.amount]) || 0;
      const paid = importMapping.paid !== undefined ? Number(row[importMapping.paid]) || 0 : 0;
      const date = importMapping.date !== undefined ? String(row[importMapping.date] || "").trim() : null;

      if (amount === 0 && paid === 0) return; // Skip empty rows

      const key = `${block}-${unit}`;
      if (!newLedger[key]) {
        newLedger[key] = { id: Date.now() + Math.random() * 10000, unit, block, name, months: [] };
      }
      if (name && !newLedger[key].name) newLedger[key].name = name;
      
      // Check for duplicate months
      const existing = newLedger[key].months.find(m => m.month === month);
      if (existing) {
        existing.amount += amount;
        existing.paid += paid;
        if (date && !existing.date) existing.date = date;
      } else {
        newLedger[key].months.push({ month: month || "2026.03", amount, paid, date: date || null });
      }
    });

    const entries = Object.values(newLedger).filter(e => e.months.length > 0);
    // Sort months within each entry
    entries.forEach(e => e.months.sort((a, b) => a.month.localeCompare(b.month)));
    
    if (entries.length > 0) {
      setLedger(entries);
    }
    setImportStep(3);
  };

  const downloadTemplate = () => {
    if (!window.XLSX) return;
    const ws = window.XLSX.utils.aoa_to_sheet([
      ["Тоот", "Блок", "Нэр", "Сар", "Нэхэмжлэх дүн", "Төлсөн дүн", "Төлсөн огноо"],
      [45, "A", "Бат-Эрдэнэ", "2026.01", 80000, 80000, "2026.01.15"],
      [45, "A", "Бат-Эрдэнэ", "2026.02", 80000, 80000, "2026.02.10"],
      [45, "A", "Бат-Эрдэнэ", "2026.03", 80000, 0, ""],
      [46, "A", "Сарангэрэл", "2026.01", 80000, 80000, "2026.01.20"],
      [46, "A", "Сарангэрэл", "2026.02", 80000, 0, ""],
      [46, "A", "Сарангэрэл", "2026.03", 80000, 0, ""],
    ]);
    ws["!cols"] = [{ wch: 6 }, { wch: 6 }, { wch: 14 }, { wch: 10 }, { wch: 14 }, { wch: 12 }, { wch: 14 }];
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Хар дэвтэр");
    window.XLSX.writeFile(wb, "sokh_ledger_template.xlsx");
  };

  const exportLedger = () => {
    if (!window.XLSX) return;
    const data = [];
    ledger.forEach(e => {
      e.months.forEach(m => {
        data.push({
          "Тоот": e.unit, "Блок": e.block, "Нэр": e.name,
          "Сар": m.month, "Нэхэмжлэх": m.amount, "Төлсөн": m.paid,
          "Үлдэгдэл": m.amount - m.paid, "Огноо": m.date || "",
        });
      });
    });
    const ws = window.XLSX.utils.json_to_sheet(data);
    const wb = window.XLSX.utils.book_new();
    window.XLSX.utils.book_append_sheet(wb, ws, "Хар дэвтэр");
    window.XLSX.writeFile(wb, `sokh_ledger_${new Date().toISOString().slice(0, 10)}.xlsx`);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Summary Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 14 }}>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444" }}>{fmt(totalDebt)}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Нийт өр</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#22C55E" }}>{fmt(totalPaid)}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Нийт төлсөн</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 12 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>{debtCount}</div>
          <div style={{ fontSize: 10, color: "#94A3B8" }}>Өртэй айл</div>
        </div>
      </div>

      {/* Search & Filters */}
      <div style={{ ...S.card, margin: "0 0 12px", padding: 14 }}>
        <div style={{ display: "flex", gap: 8, marginBottom: 10 }}>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Нэр, тоот хайх..." style={{ ...S.input, flex: 1 }} />
          <select value={filterBlock} onChange={e => setFilterBlock(e.target.value)} style={{ ...S.input, width: 80, padding: "10px 8px" }}>
            <option value="all">Бүгд</option>
            <option value="A">A</option>
            <option value="B">B</option>
          </select>
        </div>
        <div style={{ display: "flex", gap: 6 }}>
          {[
            { id: "all", label: "Бүгд", color: "#64748B" },
            { id: "debt", label: "Өртэй", color: "#EF4444" },
            { id: "paid", label: "Төлсөн", color: "#22C55E" },
          ].map(f => (
            <button key={f.id} onClick={() => setFilterStatus(f.id)} style={{
              flex: 1, padding: "8px 0", borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: "pointer",
              border: filterStatus === f.id ? `2px solid ${f.color}` : "2px solid #E2E8F0",
              background: filterStatus === f.id ? `${f.color}10` : "#F8FAFC",
              color: filterStatus === f.id ? f.color : "#94A3B8", transition: "all 0.2s",
            }}>{f.label}</button>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div style={{ display: "flex", gap: 8, marginBottom: 14 }}>
        <button onClick={() => { setShowImport(true); setImportStep(1); setImportData(null); setImportError(""); }} style={{ ...S.btn("#059669"), flex: 1, fontSize: 12, padding: "12px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          📥 Excel оруулах
        </button>
        <button onClick={exportLedger} style={{ ...S.btn("#7C3AED"), flex: 1, fontSize: 12, padding: "12px 10px", display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          📤 Excel татах
        </button>
      </div>

      {/* Ledger List */}
      {filtered.map(e => {
        const debt = getDebt(e);
        const paidTotal = getTotalPaid(e);
        const totalAmt = getTotalAmount(e);
        const pct = totalAmt > 0 ? Math.round((paidTotal / totalAmt) * 100) : 0;
        return (
          <div key={e.id} style={{ ...S.card, margin: "0 0 10px", padding: 0, overflow: "hidden", cursor: "pointer" }} onClick={() => setViewUnit(e)}>
            <div style={{ padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{
                    width: 40, height: 40, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center",
                    background: debt > 0 ? "#FEF2F2" : "#F0FDF4", fontSize: 16, fontWeight: 800,
                    color: debt > 0 ? "#EF4444" : "#22C55E",
                  }}>
                    {e.block}{e.unit}
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: 14 }}>{e.name || `${e.block}-${e.unit} тоот`}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 2 }}>{e.months.length} сар · {pct}% төлсөн</div>
                  </div>
                </div>
                <div style={{ textAlign: "right" }}>
                  {debt > 0 ? (
                    <div style={{ fontSize: 16, fontWeight: 800, color: "#EF4444" }}>-{fmt(debt)}</div>
                  ) : (
                    <div style={{ fontSize: 14, fontWeight: 700, color: "#22C55E" }}>✓ Төлсөн</div>
                  )}
                </div>
              </div>
              {/* Progress bar */}
              <div style={{ marginTop: 10, height: 4, background: "#F1F5F9", borderRadius: 2, overflow: "hidden" }}>
                <div style={{ width: `${pct}%`, height: "100%", background: debt > 0 ? "#F59E0B" : "#22C55E", borderRadius: 2, transition: "width 0.5s" }} />
              </div>
              {/* Month pills */}
              <div style={{ display: "flex", gap: 4, marginTop: 8, flexWrap: "wrap" }}>
                {e.months.map((m, i) => (
                  <span key={i} style={{
                    padding: "2px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                    background: m.paid >= m.amount ? "#DCFCE7" : m.paid > 0 ? "#FEF3C7" : "#FEE2E2",
                    color: m.paid >= m.amount ? "#166534" : m.paid > 0 ? "#92400E" : "#991B1B",
                  }}>
                    {m.month.slice(5)} {m.paid >= m.amount ? "✓" : m.paid > 0 ? "½" : "✗"}
                  </span>
                ))}
              </div>
            </div>
          </div>
        );
      })}

      {filtered.length === 0 && (
        <div style={{ textAlign: "center", padding: 40, color: "#94A3B8" }}>
          <div style={{ fontSize: 36, marginBottom: 8 }}>📒</div>
          <div>Илэрц олдсонгүй</div>
        </div>
      )}

      {/* Unit Detail Modal */}
      {viewUnit && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => setViewUnit(null)}>
          <div style={{
            background: "#fff", borderRadius: 20, maxWidth: 420, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden", maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div style={{
              background: getDebt(viewUnit) > 0
                ? "linear-gradient(135deg, #DC2626, #991B1B)"
                : "linear-gradient(135deg, #16A34A, #166534)",
              padding: 24, color: "#fff", textAlign: "center",
            }}>
              <div style={{ fontSize: 14, opacity: 0.8 }}>{viewUnit.block} блок</div>
              <div style={{ fontSize: 28, fontWeight: 800, margin: "4px 0" }}>{viewUnit.unit} тоот</div>
              <div style={{ fontSize: 14, opacity: 0.9 }}>{viewUnit.name}</div>
              <div style={{ fontSize: 32, fontWeight: 800, marginTop: 12 }}>
                {getDebt(viewUnit) > 0 ? `-${fmt(getDebt(viewUnit))}` : "Өргүй ✓"}
              </div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 4 }}>
                Нийт: {fmt(getTotalAmount(viewUnit))} · Төлсөн: {fmt(getTotalPaid(viewUnit))}
              </div>
            </div>

            {/* Monthly breakdown */}
            <div style={{ padding: 20 }}>
              <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Сарын задаргаа</div>
              {viewUnit.months.map((m, i) => {
                const mDebt = m.amount - m.paid;
                return (
                  <div key={i} style={{
                    display: "flex", alignItems: "center", padding: "12px 0",
                    borderBottom: i < viewUnit.months.length - 1 ? "1px solid #F5F5F5" : "none",
                  }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{m.month}</div>
                      {m.date && <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>Төлсөн: {m.date}</div>}
                    </div>
                    <div style={{ textAlign: "right", marginRight: 10 }}>
                      <div style={{ fontSize: 12, color: "#94A3B8" }}>Нэхэмжлэх: {fmt(m.amount)}</div>
                      <div style={{ fontSize: 12, color: "#22C55E", fontWeight: 600 }}>Төлсөн: {fmt(m.paid)}</div>
                    </div>
                    <span style={S.badge(
                      mDebt === 0 ? "#22C55E" : mDebt < m.amount ? "#F59E0B" : "#EF4444",
                      mDebt === 0 ? "#DCFCE7" : mDebt < m.amount ? "#FEF3C7" : "#FEE2E2"
                    )}>
                      {mDebt === 0 ? "✓" : `-${fmt(mDebt)}`}
                    </span>
                  </div>
                );
              })}
            </div>

            <div style={{ padding: "0 20px 20px" }}>
              <button onClick={() => setViewUnit(null)} style={{ ...S.btn(accent), width: "100%" }}>Хаах</button>
            </div>
          </div>
        </div>
      )}

      {/* Excel Import Modal */}
      {showImport && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16,
        }} onClick={() => setShowImport(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24, maxWidth: 460, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)", maxHeight: "90vh", overflowY: "auto",
          }} onClick={e => e.stopPropagation()}>

            {importStep === 1 && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>📒 Хар дэвтэр Excel оруулах</div>
                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 16 }}>Өр авлагын мэдээллийг Excel-ээс импорт хийнэ</div>

                <div onClick={() => document.getElementById("ledger-excel").click()} style={{
                  border: "2px dashed #CBD5E1", borderRadius: 16, padding: 32,
                  textAlign: "center", cursor: "pointer", background: "#FAFBFC", marginBottom: 16,
                }}>
                  <div style={{ fontSize: 40, marginBottom: 8 }}>📊</div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: "#374151" }}>Excel файл сонгох</div>
                  <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>.xlsx, .xls, .csv</div>
                  <input id="ledger-excel" type="file" accept=".xlsx,.xls,.csv" onChange={handleExcelUpload} style={{ display: "none" }} />
                </div>

                {importError && (
                  <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 12, marginBottom: 12, fontSize: 12, color: "#991B1B" }}>⚠️ {importError}</div>
                )}

                <div style={{ background: "#F0FDF4", borderRadius: 12, padding: 14, marginBottom: 16 }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: "#166534", marginBottom: 6 }}>💡 Excel бүтэц</div>
                  <div style={{ fontSize: 11, color: "#166534", lineHeight: 1.5 }}>
                    Заавал: <strong>Тоот, Сар, Нэхэмжлэх дүн, Төлсөн дүн</strong>. Мөр бүр нэг тоотын нэг сарын мэдээлэл. Нэг тоот олон мөрөнд давтагдаж болно.
                  </div>
                  <button onClick={downloadTemplate} style={{
                    marginTop: 8, background: "#22C55E", color: "#fff", border: "none", borderRadius: 8,
                    padding: "8px 14px", fontSize: 12, fontWeight: 600, cursor: "pointer",
                  }}>📥 Загвар татах</button>
                </div>

                <button onClick={() => setShowImport(false)} style={{ ...S.btnOutline, width: "100%", borderRadius: 12 }}>Болих</button>
              </div>
            )}

            {importStep === 2 && importData && (
              <div>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 6 }}>🔗 Баганууд тохируулах</div>

                {/* Sheet info */}
                {importData.sheetInfo && (
                  <div style={{ background: "#EFF6FF", borderRadius: 10, padding: 12, marginBottom: 12 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: "#1E40AF", marginBottom: 6 }}>
                      📑 {importData.totalSheets} хуудас уншлаа · Нийт {importData.rows.length} мөр
                    </div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {importData.sheetInfo.map((s, i) => (
                        <span key={i} style={{
                          padding: "3px 8px", borderRadius: 6, fontSize: 10, fontWeight: 600,
                          background: s.rows > 0 ? "#DCFCE7" : "#FEE2E2",
                          color: s.rows > 0 ? "#166534" : "#991B1B",
                        }}>
                          {s.name}: {s.rows > 0 ? `${s.rows} мөр` : s.status}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                <div style={{ fontSize: 12, color: "#64748B", marginBottom: 10 }}>Багана бүрийг зөв талбартай холбоно уу</div>

                {LEDGER_FIELDS.map(f => (
                  <div key={f.key} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 0", borderBottom: "1px solid #F5F5F5" }}>
                    <div style={{ flex: 1, fontSize: 12, fontWeight: 600 }}>
                      {f.label} {f.required && <span style={{ color: "#EF4444" }}>*</span>}
                      {importMapping[f.key] !== undefined && <span style={{ color: "#22C55E", marginLeft: 4 }}>✓</span>}
                    </div>
                    <select value={importMapping[f.key] !== undefined ? importMapping[f.key] : ""} onChange={e => setImportMapping(p => ({ ...p, [f.key]: e.target.value === "" ? undefined : Number(e.target.value) }))} style={{ ...S.input, width: 150, padding: "6px 8px", fontSize: 12 }}>
                      <option value="">-- Сонгох --</option>
                      {importData.headers.map((h, i) => <option key={i} value={i}>{h}</option>)}
                    </select>
                  </div>
                ))}

                {importError && <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 10, marginTop: 10, fontSize: 12, color: "#991B1B" }}>⚠️ {importError}</div>}

                <div style={{ display: "flex", gap: 10, marginTop: 16 }}>
                  <button onClick={() => setImportStep(1)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>← Буцах</button>
                  <button onClick={() => {
                    if (importMapping.unit === undefined || importMapping.amount === undefined) {
                      setImportError("Дор хаяж Тоот, Нэхэмжлэх дүн баганыг сонгоно уу");
                      return;
                    }
                    setImportError("");
                    handleImportConfirm();
                  }} style={{ ...S.btn(accent), flex: 1 }}>{importData.rows.length} мөр оруулах →</button>
                </div>
              </div>
            )}

            {importStep === 3 && (
              <div style={{ textAlign: "center", padding: "20px 0" }}>
                <div style={{ fontSize: 52, marginBottom: 12 }}>🎉</div>
                <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 6 }}>Амжилттай!</div>
                <div style={{ fontSize: 14, color: "#64748B", marginBottom: 8 }}>Хар дэвтэр шинэчлэгдлээ</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: accent, marginBottom: 20 }}>
                  {ledger.length} айл · {ledger.reduce((s, e) => s + e.months.length, 0)} бичилт
                </div>
                <button onClick={() => setShowImport(false)} style={{ ...S.btn(accent), width: "100%" }}>Хаах</button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ADMIN DASHBOARD ─── */

function AdminDashboard({ payments, requests, goTo, org, onOrgSave, onLogout }) {
  const totalIncome = UNITS.filter(u => u.paid).length * 80000;
  const totalExpense = EXPENSES.reduce((s, e) => s + e.amount, 0);
  const unpaidCount = UNITS.filter(u => !u.paid).length;
  const openReqs = requests.filter(r => r.status !== "done").length;
  const accent = org?.color || "#2563EB";

  const [adminTab, setAdminTab] = useState("dashboard");

  const AdminNav = () => (
    <div style={{ 
      display: "flex", gap: 4, padding: "0 16px 16px", overflowX: "auto",
      justifyContent: "flex-start", WebkitOverflowScrolling: "touch",
      scrollbarWidth: "none", msOverflowStyle: "none",
    }}>
      {[
        { id: "dashboard", icon: "📊", label: "Хянах" },
        { id: "units", icon: "🏢", label: "Айлууд" },
        { id: "residents", icon: "👥", label: "Суугч" },
        { id: "ledger", icon: "📒", label: "Хар дэвтэр" },
        { id: "invoices", icon: "💰", label: "Төлбөр" },
        { id: "expenses", icon: "📋", label: "Зарлага" },
        { id: "maintenance", icon: "🔧", label: "Засвар" },
        { id: "parking", icon: "🚗", label: "Зогсоол" },
        { id: "ai", icon: "🤖", label: "AI Хяналт" },
        { id: "report", icon: "📄", label: "Тайлан" },
        { id: "orgSettings", icon: "⚙️", label: "Тохиргоо" },
      ].map(t => (
        <button key={t.id} onClick={() => setAdminTab(t.id)} style={{
          padding: "8px 12px", borderRadius: 10, border: "none", cursor: "pointer",
          background: adminTab === t.id ? "rgba(255,255,255,0.2)" : "transparent",
          color: "#fff", fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
          transition: "all 0.2s", flexShrink: 0,
        }}>{t.icon} {t.label}</button>
      ))}
    </div>
  );

  return (
    <div>
      <div style={{ ...S.header, background: `linear-gradient(135deg, ${accent} 0%, ${accent}CC 100%)`, paddingBottom: 0 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 14 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {org?.logo ? (
              <img src={org.logo} alt="" style={{ width: 36, height: 36, borderRadius: 8, objectFit: "contain", background: "#fff", padding: 2 }} />
            ) : (
              <div style={{ fontSize: 20 }}>🏢</div>
            )}
            <div>
              <div style={{ fontSize: 18, fontWeight: 800 }}>{org?.name || "СӨХ Удирдлага"}</div>
              <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2, display: "flex", alignItems: "center", gap: 6 }}>
                🔐 Super Admin · 2026 оны 3-р сар
              </div>
            </div>
          </div>
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.2)",
            borderRadius: 10, padding: "6px 12px", color: "#fff", fontSize: 11, fontWeight: 600,
            cursor: "pointer", display: "flex", alignItems: "center", gap: 4,
          }}>
            🚪 Гарах
          </button>
        </div>
        <AdminNav />
      </div>

      {adminTab === "dashboard" && (
        <div style={{ padding: 16 }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 12 }}>
            {[
              { label: "Орлого (сар)", value: fmt(totalIncome), color: "#22C55E", icon: "📈" },
              { label: "Зарлага (сар)", value: fmt(totalExpense), color: "#EF4444", icon: "📉" },
              { label: "Өртэй айл", value: unpaidCount, color: "#F59E0B", icon: "⚠️" },
              { label: "Нээлттэй хүсэлт", value: openReqs, color: "#2563EB", icon: "🔧" },
            ].map(s => (
              <div key={s.label} style={{ ...S.card, margin: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <span style={{ fontSize: 11, color: "#94A3B8", fontWeight: 500 }}>{s.label}</span>
                  <span style={{ fontSize: 18 }}>{s.icon}</span>
                </div>
                <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6, color: s.color }}>{s.value}</div>
              </div>
            ))}
          </div>

          {/* Simple chart */}
          <div style={{ ...S.card, margin: 0, marginTop: 4 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 16 }}>Орлого vs Зарлага</div>
            <div style={{ display: "flex", alignItems: "end", gap: 12, height: 120 }}>
              {[
                { label: "1-р сар", income: 80, expense: 65 },
                { label: "2-р сар", income: 85, expense: 70 },
                { label: "3-р сар", income: 75, expense: 60 },
              ].map(m => (
                <div key={m.label} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ display: "flex", gap: 4, alignItems: "end", height: 100 }}>
                    <div style={{ width: 20, height: m.income, background: "linear-gradient(180deg, #22C55E, #16A34A)", borderRadius: "4px 4px 0 0", transition: "height 0.5s" }} />
                    <div style={{ width: 20, height: m.expense, background: "linear-gradient(180deg, #EF4444, #DC2626)", borderRadius: "4px 4px 0 0", transition: "height 0.5s" }} />
                  </div>
                  <div style={{ fontSize: 10, color: "#94A3B8" }}>{m.label}</div>
                </div>
              ))}
            </div>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", marginTop: 12 }}>
              <span style={{ fontSize: 11, color: "#22C55E" }}>● Орлого</span>
              <span style={{ fontSize: 11, color: "#EF4444" }}>● Зарлага</span>
            </div>
          </div>
        </div>
      )}

      {adminTab === "units" && (
        <div style={{ padding: 16 }}>
          <div style={{ ...S.card, margin: 0, padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: "#F8FAFC" }}>
                  {["Тоот", "Талбай", "Төрөл", "Төлбөр"].map(h => (
                    <th key={h} style={{ padding: "12px 14px", textAlign: "left", fontWeight: 700, color: "#64748B", fontSize: 11, borderBottom: "1px solid #F1F5F9" }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {UNITS.map(u => (
                  <tr key={u.id} style={{ borderBottom: "1px solid #F8FAFC" }}>
                    <td style={{ padding: "12px 14px", fontWeight: 600 }}>{u.block}-{u.id}</td>
                    <td style={{ padding: "12px 14px", color: "#64748B" }}>{u.size}м²</td>
                    <td style={{ padding: "12px 14px" }}><span style={S.badge(u.type === "Owner" ? "#2563EB" : "#7C3AED", u.type === "Owner" ? "#EFF6FF" : "#F5F3FF")}>{u.type === "Owner" ? "Эзэмшигч" : "Түрээслэгч"}</span></td>
                    <td style={{ padding: "12px 14px" }}><span style={S.badge(u.paid ? "#22C55E" : "#EF4444", u.paid ? "#DCFCE7" : "#FEE2E2")}>{u.paid ? "Төлсөн" : "Өргүй"}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {adminTab === "residents" && (
        <ResidentsTab accent={accent} />
      )}

      {adminTab === "ledger" && (
        <LedgerTab accent={accent} org={org} />
      )}

      {adminTab === "invoices" && (
        <div style={{ padding: 16 }}>
          {UNITS.map(u => (
            <div key={u.id} style={{ ...S.card, margin: "0 0 10px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <div style={{ fontWeight: 700, fontSize: 14 }}>{u.block}-{u.id} тоот</div>
                <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{fmt(80000)}</div>
              </div>
              <span style={S.badge(u.paid ? "#22C55E" : "#EF4444", u.paid ? "#DCFCE7" : "#FEE2E2")}>{u.paid ? "✓ Төлсөн" : "Төлөөгүй"}</span>
            </div>
          ))}
        </div>
      )}

      {adminTab === "expenses" && (
        <div style={{ padding: 16 }}>
          <div style={{ ...S.card, margin: "0 0 12px", background: "linear-gradient(135deg, #1E3A5F, #0F172A)", color: "#fff", textAlign: "center" }}>
            <div style={{ fontSize: 12, opacity: 0.7 }}>Нийт зарлага</div>
            <div style={{ fontSize: 28, fontWeight: 800, marginTop: 8 }}>{fmt(EXPENSES.reduce((s, e) => s + e.amount, 0))}</div>
          </div>
          {EXPENSES.map(e => (
            <div key={e.id} style={{ ...S.card, margin: "0 0 10px", display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ fontSize: 28, width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center", background: "#F8FAFC", borderRadius: 12 }}>{e.icon}</div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 600, fontSize: 14 }}>{e.label}</div>
              </div>
              <div style={{ fontWeight: 800, fontSize: 16 }}>{fmt(e.amount)}</div>
            </div>
          ))}
        </div>
      )}

      {adminTab === "maintenance" && (
        <div style={{ padding: 16 }}>
          {requests.map(r => {
            const st = STATUS_MAP[r.status];
            return (
              <div key={r.id} style={{ ...S.card, margin: "0 0 10px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                  <div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{r.unit} тоот · {r.cat}</div>
                    <div style={{ fontWeight: 700, fontSize: 14, marginTop: 4 }}>{r.title}</div>
                    <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{r.desc}</div>
                  </div>
                  <span style={S.badge(st.color, st.bg)}>{st.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {adminTab === "parking" && (
        <ParkingTab accent={accent} />
      )}

      {adminTab === "ai" && (
        <AIControlTab accent={accent} org={org} />
      )}

      {adminTab === "report" && (
        <ShilenReport org={org} accent={accent} />
      )}

      {adminTab === "orgSettings" && (
        <div style={{ maxWidth: 440, margin: "0 auto" }}>
          <OrgSetupScreen org={org} onSave={onOrgSave} isFirstTime={false} />
        </div>
      )}
    </div>
  );
}

/* ─── AI ХЯНАЛТ ─── */
function AIControlTab({ accent, org }) {
  const [tab, setTab] = useState("cameras"); // cameras | aiFeatures | alerts | analytics
  const [cameras, setCameras] = useState([
    { id: 1, name: "Үүдний камер", location: "A блок оролт", ip: "192.168.1.101", brand: "Hikvision", status: "online", type: "entrance", aiEnabled: true, lprEnabled: true, faceEnabled: false },
    { id: 2, name: "Зогсоолын камер", location: "B1 зогсоол", ip: "192.168.1.102", brand: "Dahua", status: "online", type: "parking", aiEnabled: true, lprEnabled: true, faceEnabled: false },
    { id: 3, name: "Лифтний камер", location: "A блок лифт", ip: "192.168.1.103", brand: "Hikvision", status: "offline", type: "indoor", aiEnabled: true, lprEnabled: false, faceEnabled: true },
    { id: 4, name: "Хашааны камер", location: "Хойд хашаа", ip: "192.168.1.104", brand: "Dahua", status: "online", type: "perimeter", aiEnabled: true, lprEnabled: false, faceEnabled: false },
    { id: 5, name: "Хүүхдийн тоглоомын камер", location: "Тоглоомын талбай", ip: "192.168.1.105", brand: "Hikvision", status: "online", type: "outdoor", aiEnabled: true, lprEnabled: false, faceEnabled: false },
  ]);
  const [showAddCamera, setShowAddCamera] = useState(false);
  const [camForm, setCamForm] = useState({ name: "", location: "", ip: "", brand: "Hikvision", type: "entrance" });

  const [alerts, setAlerts] = useState([
    { id: 1, type: "intrusion", cam: "Хашааны камер", msg: "Сэжигтэй хөдөлгөөн илэрсэн", time: "2026.03.15 23:42", severity: "high", read: false },
    { id: 2, type: "plate", cam: "Зогсоолын камер", msg: "Бүртгэлгүй машин УБЗ 9999 зогсоолд орсон", time: "2026.03.15 18:15", severity: "medium", read: false },
    { id: 3, type: "loiter", cam: "Үүдний камер", msg: "15 минутаас дээш зогссон хүн илэрсэн", time: "2026.03.15 16:30", severity: "low", read: true },
    { id: 4, type: "fire", cam: "Хашааны камер", msg: "Утаа/гал илэрсэн (хуурамч дохио байж болно)", time: "2026.03.14 02:10", severity: "high", read: true },
    { id: 5, type: "crowd", cam: "Үүдний камер", msg: "Олон хүн цугларсан (8+ хүн)", time: "2026.03.14 20:45", severity: "medium", read: true },
    { id: 6, type: "face", cam: "Лифтний камер", msg: "Танигдаагүй хүн A блокт нэвтэрсэн", time: "2026.03.13 14:20", severity: "medium", read: true },
  ]);

  const [aiSettings, setAiSettings] = useState({
    intrusionDetect: true,
    loiterDetect: true,
    fireDetect: true,
    crowdDetect: true,
    faceRecognition: false,
    lprEnabled: true,
    packageDetect: true,
    fallDetect: true,
    noiseDetect: false,
    alertPhone: "99019927",
    alertPush: true,
    alertSMS: false,
    sensitivity: "medium",
    nightMode: true,
    recordDays: 30,
  });

  const SEVERITY = {
    high: { label: "Яаралтай", color: "#EF4444", bg: "#FEE2E2", icon: "🔴" },
    medium: { label: "Анхааруулга", color: "#F59E0B", bg: "#FEF3C7", icon: "🟡" },
    low: { label: "Мэдээлэл", color: "#3B82F6", bg: "#DBEAFE", icon: "🔵" },
  };

  const ALERT_TYPES = {
    intrusion: { icon: "🚨", label: "Нэвтрэлт" },
    plate: { icon: "🚗", label: "Машин" },
    loiter: { icon: "🚶", label: "Сэжигтэй" },
    fire: { icon: "🔥", label: "Гал/Утаа" },
    crowd: { icon: "👥", label: "Олон хүн" },
    face: { icon: "👤", label: "Нүүр" },
    package: { icon: "📦", label: "Илгээмж" },
    fall: { icon: "⚠️", label: "Унасан" },
  };

  const onlineCams = cameras.filter(c => c.status === "online").length;
  const unreadAlerts = alerts.filter(a => !a.read).length;

  const Toggle = ({ value, onChange, label }) => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
      <span style={{ fontSize: 13, fontWeight: 600 }}>{label}</span>
      <button onClick={() => onChange(!value)} style={{
        width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
        background: value ? "#22C55E" : "#D1D5DB", position: "relative", transition: "all 0.3s",
      }}>
        <div style={{
          width: 18, height: 18, borderRadius: 9, background: "#fff",
          position: "absolute", top: 3, left: value ? 23 : 3, transition: "all 0.3s",
          boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
        }} />
      </button>
    </div>
  );

  const addCamera = () => {
    if (!camForm.name || !camForm.ip) return;
    setCameras(prev => [...prev, { ...camForm, id: Date.now(), status: "online", aiEnabled: true, lprEnabled: camForm.type === "parking" || camForm.type === "entrance", faceEnabled: false }]);
    setCamForm({ name: "", location: "", ip: "", brand: "Hikvision", type: "entrance" });
    setShowAddCamera(false);
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Sub tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { id: "cameras", icon: "📹", label: "Камер" },
          { id: "alerts", icon: `🔔${unreadAlerts > 0 ? "" : ""}`, label: `Дохио${unreadAlerts > 0 ? ` (${unreadAlerts})` : ""}` },
          { id: "aiFeatures", icon: "🧠", label: "AI тохиргоо" },
          { id: "analytics", icon: "📈", label: "Аналитик" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 4px", borderRadius: 10, border: tab === t.id ? `2px solid ${accent}` : "2px solid #E2E8F0",
            background: tab === t.id ? `${accent}10` : "#F8FAFC", cursor: "pointer",
            fontSize: 10, fontWeight: 600, color: tab === t.id ? accent : "#64748B", transition: "all 0.2s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
        {[
          { value: `${onlineCams}/${cameras.length}`, label: "Камер", color: "#22C55E" },
          { value: unreadAlerts, label: "Шинэ дохио", color: "#EF4444" },
          { value: cameras.filter(c => c.aiEnabled).length, label: "AI идэвхтэй", color: accent },
          { value: `${aiSettings.recordDays}хн`, label: "Бичлэг", color: "#7C3AED" },
        ].map((s, i) => (
          <div key={i} style={{ ...S.card, margin: 0, textAlign: "center", padding: 10 }}>
            <div style={{ fontSize: 16, fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: 9, color: "#94A3B8" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* === CAMERAS === */}
      {tab === "cameras" && (
        <div>
          <button onClick={() => setShowAddCamera(true)} style={{ ...S.btn(accent), marginBottom: 14, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            📹 Камер нэмэх
          </button>

          {cameras.map(cam => (
            <div key={cam.id} style={{ ...S.card, margin: "0 0 10px", padding: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  width: 50, height: 38, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
                  background: cam.status === "online" ? "#0F172A" : "#F1F5F9", fontSize: 14,
                  position: "relative",
                }}>
                  📹
                  <div style={{
                    position: "absolute", top: -2, right: -2, width: 10, height: 10, borderRadius: 5,
                    background: cam.status === "online" ? "#22C55E" : "#EF4444",
                    border: "2px solid #fff",
                  }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{cam.name}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{cam.location} · {cam.brand}</div>
                </div>
                <div style={{ display: "flex", gap: 4 }}>
                  {cam.aiEnabled && <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#DBEAFE", color: "#1E40AF" }}>AI</span>}
                  {cam.lprEnabled && <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#FEF3C7", color: "#92400E" }}>LPR</span>}
                  {cam.faceEnabled && <span style={{ padding: "2px 6px", borderRadius: 4, fontSize: 9, fontWeight: 700, background: "#F3E8FF", color: "#7C3AED" }}>Face</span>}
                </div>
              </div>
              <div style={{ display: "flex", gap: 6, marginTop: 10 }}>
                <button onClick={() => setCameras(prev => prev.map(c => c.id === cam.id ? { ...c, aiEnabled: !c.aiEnabled } : c))} style={{
                  flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #E2E8F0", background: cam.aiEnabled ? `${accent}10` : "#F8FAFC",
                  fontSize: 10, fontWeight: 600, cursor: "pointer", color: cam.aiEnabled ? accent : "#94A3B8",
                }}>🧠 AI {cam.aiEnabled ? "ON" : "OFF"}</button>
                <button onClick={() => setCameras(prev => prev.map(c => c.id === cam.id ? { ...c, lprEnabled: !c.lprEnabled } : c))} style={{
                  flex: 1, padding: "6px 0", borderRadius: 8, border: "1px solid #E2E8F0", background: cam.lprEnabled ? "#FEF3C710" : "#F8FAFC",
                  fontSize: 10, fontWeight: 600, cursor: "pointer", color: cam.lprEnabled ? "#92400E" : "#94A3B8",
                }}>🚗 LPR {cam.lprEnabled ? "ON" : "OFF"}</button>
                <button onClick={() => setCameras(prev => prev.filter(c => c.id !== cam.id))} style={{
                  padding: "6px 10px", borderRadius: 8, border: "1px solid #FEE2E2", background: "#FEF2F2",
                  fontSize: 10, cursor: "pointer", color: "#EF4444",
                }}>✕</button>
              </div>
            </div>
          ))}

          {showAddCamera && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowAddCamera(false)}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>📹 Камер нэмэх</div>
                {[
                  { key: "name", label: "Камерын нэр *", placeholder: "Үүдний камер" },
                  { key: "location", label: "Байршил", placeholder: "A блок оролт" },
                  { key: "ip", label: "IP хаяг *", placeholder: "192.168.1.101" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>{f.label}</div>
                    <input value={camForm[f.key]} onChange={e => setCamForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={S.input} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Брэнд</div>
                    <select value={camForm.brand} onChange={e => setCamForm(p => ({ ...p, brand: e.target.value }))} style={S.input}>
                      {["Hikvision", "Dahua", "Uniview", "Tiandy", "ZKTeco", "Axis", "Бусад"].map(b => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Төрөл</div>
                    <select value={camForm.type} onChange={e => setCamForm(p => ({ ...p, type: e.target.value }))} style={S.input}>
                      <option value="entrance">Оролт</option>
                      <option value="parking">Зогсоол</option>
                      <option value="indoor">Дотор</option>
                      <option value="perimeter">Хашаа</option>
                      <option value="outdoor">Гадна</option>
                    </select>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowAddCamera(false)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Болих</button>
                  <button onClick={addCamera} style={{ ...S.btn(accent), flex: 1 }}>Нэмэх</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === ALERTS === */}
      {tab === "alerts" && (
        <div>
          {unreadAlerts > 0 && (
            <button onClick={() => setAlerts(prev => prev.map(a => ({ ...a, read: true })))} style={{ ...S.btn("#64748B"), marginBottom: 14, fontSize: 12, padding: "10px 16px" }}>
              ✓ Бүгдийг уншсан гэж тэмдэглэх
            </button>
          )}
          {alerts.map(a => {
            const sev = SEVERITY[a.severity];
            const aType = ALERT_TYPES[a.type] || { icon: "⚠️", label: "Бусад" };
            return (
              <div key={a.id} onClick={() => setAlerts(prev => prev.map(x => x.id === a.id ? { ...x, read: true } : x))} style={{
                ...S.card, margin: "0 0 8px", padding: 14, cursor: "pointer",
                borderLeft: `4px solid ${sev.color}`,
                background: a.read ? "#fff" : sev.bg,
                opacity: a.read ? 0.7 : 1,
              }}>
                <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
                  <div style={{ fontSize: 22 }}>{aType.icon}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 4 }}>
                      <span style={{ fontWeight: 700, fontSize: 13 }}>{a.msg}</span>
                      {!a.read && <span style={{ width: 8, height: 8, borderRadius: 4, background: sev.color }} />}
                    </div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>📹 {a.cam} · {a.time}</div>
                  </div>
                  <span style={S.badge(sev.color, sev.bg)}>{sev.label}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* === AI FEATURES === */}
      {tab === "aiFeatures" && (
        <div>
          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 4 }}>🧠 AI Илрүүлэлт</div>
            <div style={{ fontSize: 11, color: "#94A3B8", marginBottom: 12 }}>Камеруудад ажиллах AI функцүүд</div>
            <Toggle label="🚨 Зөвшөөрөлгүй нэвтрэлт илрүүлэх" value={aiSettings.intrusionDetect} onChange={v => setAiSettings(p => ({ ...p, intrusionDetect: v }))} />
            <Toggle label="🚶 Сэжигтэй зогсолт илрүүлэх (15+ мин)" value={aiSettings.loiterDetect} onChange={v => setAiSettings(p => ({ ...p, loiterDetect: v }))} />
            <Toggle label="🔥 Гал / утаа илрүүлэх" value={aiSettings.fireDetect} onChange={v => setAiSettings(p => ({ ...p, fireDetect: v }))} />
            <Toggle label="👥 Олон хүн цуглалт илрүүлэх" value={aiSettings.crowdDetect} onChange={v => setAiSettings(p => ({ ...p, crowdDetect: v }))} />
            <Toggle label="👤 Нүүр таних (Face Recognition)" value={aiSettings.faceRecognition} onChange={v => setAiSettings(p => ({ ...p, faceRecognition: v }))} />
            <Toggle label="🚗 Машины дугаар таних (LPR)" value={aiSettings.lprEnabled} onChange={v => setAiSettings(p => ({ ...p, lprEnabled: v }))} />
            <Toggle label="📦 Илгээмж/ачаа илрүүлэх" value={aiSettings.packageDetect} onChange={v => setAiSettings(p => ({ ...p, packageDetect: v }))} />
            <Toggle label="⚠️ Хүн унасан илрүүлэх (ахмад настан)" value={aiSettings.fallDetect} onChange={v => setAiSettings(p => ({ ...p, fallDetect: v }))} />
            <Toggle label="🔊 Чанга дуу / хашгирах илрүүлэх" value={aiSettings.noiseDetect} onChange={v => setAiSettings(p => ({ ...p, noiseDetect: v }))} />
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🔔 Мэдэгдэл тохиргоо</div>
            <Toggle label="📱 Push мэдэгдэл" value={aiSettings.alertPush} onChange={v => setAiSettings(p => ({ ...p, alertPush: v }))} />
            <Toggle label="💬 SMS мэдэгдэл" value={aiSettings.alertSMS} onChange={v => setAiSettings(p => ({ ...p, alertSMS: v }))} />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Мэдэгдэл авах утас</div>
              <input value={aiSettings.alertPhone} onChange={e => setAiSettings(p => ({ ...p, alertPhone: e.target.value }))} style={S.input} />
            </div>
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>⚙️ Нэмэлт тохиргоо</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>AI мэдрэмж</div>
              <select value={aiSettings.sensitivity} onChange={e => setAiSettings(p => ({ ...p, sensitivity: e.target.value }))} style={S.input}>
                <option value="low">Бага — зөвхөн итгэлтэй дохио</option>
                <option value="medium">Дунд — тэнцвэртэй</option>
                <option value="high">Өндөр — бүх сэжигтэй зүйл</option>
              </select>
            </div>
            <Toggle label="🌙 Шөнийн горим (IR сайжруулалт)" value={aiSettings.nightMode} onChange={v => setAiSettings(p => ({ ...p, nightMode: v }))} />
            <div style={{ marginTop: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Бичлэг хадгалах хоног</div>
              <select value={aiSettings.recordDays} onChange={e => setAiSettings(p => ({ ...p, recordDays: Number(e.target.value) }))} style={S.input}>
                {[7, 14, 30, 60, 90].map(d => <option key={d} value={d}>{d} хоног</option>)}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* === ANALYTICS === */}
      {tab === "analytics" && (
        <div>
          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>📊 AI Дүн шинжилгээ (7 хоног)</div>
            {[
              { label: "Нэвтэрсэн хүн", value: "2,847", change: "+12%", icon: "🚶", color: accent },
              { label: "Танигдсан машин", value: "489", change: "+5%", icon: "🚗", color: "#22C55E" },
              { label: "Бүртгэлгүй машин", value: "23", change: "-8%", icon: "⚠️", color: "#F59E0B" },
              { label: "AI дохио", value: "7", change: "-30%", icon: "🔔", color: "#EF4444" },
              { label: "Хуурамч дохио", value: "2", change: "-50%", icon: "❌", color: "#94A3B8" },
            ].map(s => (
              <div key={s.label} style={{ display: "flex", alignItems: "center", padding: "12px 0", borderBottom: "1px solid #F5F5F5" }}>
                <span style={{ fontSize: 20, width: 32 }}>{s.icon}</span>
                <span style={{ flex: 1, fontSize: 13, fontWeight: 600 }}>{s.label}</span>
                <span style={{ fontSize: 16, fontWeight: 800, color: s.color, marginRight: 8 }}>{s.value}</span>
                <span style={{ fontSize: 11, fontWeight: 600, color: s.change.startsWith("+") ? "#22C55E" : "#EF4444", background: s.change.startsWith("+") ? "#DCFCE7" : "#FEE2E2", padding: "2px 8px", borderRadius: 6 }}>{s.change}</span>
              </div>
            ))}
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 14 }}>🕐 Оргил цаг (хүн нэвтрэлт)</div>
            <div style={{ display: "flex", alignItems: "end", gap: 4, height: 80 }}>
              {[
                { h: "06", v: 10 }, { h: "08", v: 65 }, { h: "10", v: 40 },
                { h: "12", v: 50 }, { h: "14", v: 35 }, { h: "16", v: 30 },
                { h: "18", v: 75 }, { h: "20", v: 55 }, { h: "22", v: 20 },
              ].map(t => (
                <div key={t.h} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
                  <div style={{ width: "100%", height: t.v, background: `linear-gradient(180deg, ${accent}, ${accent}88)`, borderRadius: "4px 4px 0 0", transition: "height 0.5s" }} />
                  <div style={{ fontSize: 9, color: "#94A3B8" }}>{t.h}</div>
                </div>
              ))}
            </div>
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 15, fontWeight: 800, marginBottom: 12 }}>🏆 AI-ийн ачаар</div>
            {[
              { icon: "🛡️", text: "3 удаагийн сэжигтэй нэвтрэлтийг илрүүлсэн", time: "Энэ сард" },
              { icon: "🚗", text: "15 бүртгэлгүй машиныг автомат хориглосон", time: "Энэ сард" },
              { icon: "🔥", text: "1 удаагийн утааны дохио (хуурамч биш)", time: "Өнгөрсөн сард" },
              { icon: "👴", text: "Ахмад настны уналтыг илрүүлж яаралтай тусламж дуудсан", time: "2 сарын өмнө" },
            ].map((a, i) => (
              <div key={i} style={{ display: "flex", gap: 10, padding: "10px 0", borderBottom: i < 3 ? "1px solid #F5F5F5" : "none" }}>
                <span style={{ fontSize: 20 }}>{a.icon}</span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{a.text}</div>
                  <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{a.time}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ЗОГСООЛ (PARKING) ─── */
const INIT_VEHICLES = [
  { id: 1, plate: "УБА 1234", unit: 45, block: "A", owner: "Бат-Эрдэнэ", spot: "#12", type: "resident", color: "Цагаан", model: "Prius", registered: "2020.06" },
  { id: 2, plate: "УБЕ 5678", unit: 46, block: "A", owner: "Сарангэрэл", spot: "#13", type: "resident", color: "Хар", model: "Tucson", registered: "2021.01" },
  { id: 3, plate: "УБГ 9012", unit: 32, block: "B", owner: "Мөнхбаяр", spot: "#08", type: "resident", color: "Саарал", model: "Santa Fe", registered: "2019.11" },
  { id: 4, plate: "УБД 3456", unit: 51, block: "A", owner: "Ганбаатар", spot: "#15", type: "resident", color: "Цэнхэр", model: "Camry", registered: "2022.05" },
];

const INIT_GUESTS = [
  { id: 101, plate: "УБЦ 7777", visitor: "Болд", hostUnit: 45, hostName: "Бат-Эрдэнэ", entryTime: "2026.03.15 14:30", exitTime: null, allowedHours: 2, status: "active" },
  { id: 102, plate: "ДО 8888", visitor: "Цэцэгмаа", hostUnit: 32, hostName: "Мөнхбаяр", entryTime: "2026.03.15 10:00", exitTime: "2026.03.15 11:30", allowedHours: 3, status: "exited" },
  { id: 103, plate: "УБН 4444", visitor: "Дэлгэрмаа", hostUnit: 46, hostName: "Сарангэрэл", entryTime: "2026.03.14 09:00", exitTime: "2026.03.14 18:00", allowedHours: 2, status: "overtime", overtimeHours: 7, overtimeFee: 7000 },
];

function ParkingTab({ accent }) {
  const [vehicles, setVehicles] = useState(INIT_VEHICLES);
  const [guests, setGuests] = useState(INIT_GUESTS);
  const [tab, setTab] = useState("vehicles"); // vehicles | guests | gate | settings
  const [showAddVehicle, setShowAddVehicle] = useState(false);
  const [showAddGuest, setShowAddGuest] = useState(false);
  const [search, setSearch] = useState("");
  const [vForm, setVForm] = useState({ plate: "", unit: "", block: "A", owner: "", spot: "", color: "", model: "" });
  const [gForm, setGForm] = useState({ plate: "", visitor: "", hostUnit: "", hostName: "", allowedHours: 2 });
  const [overtimeRate, setOvertimeRate] = useState(1000); // ₮ per hour
  const [freeHours, setFreeHours] = useState(2);
  const [gateConnected, setGateConnected] = useState(false);
  const [gateIP, setGateIP] = useState("");
  const [gateBrand, setGateBrand] = useState("");
  const [viewVehicle, setViewVehicle] = useState(null);

  const totalSpots = 30;
  const usedSpots = vehicles.length;
  const activeGuests = guests.filter(g => g.status === "active").length;
  const overtimeGuests = guests.filter(g => g.status === "overtime");
  const totalOvertimeFee = overtimeGuests.reduce((s, g) => s + (g.overtimeFee || 0), 0);

  const addVehicle = () => {
    if (!vForm.plate || !vForm.unit) return;
    setVehicles(prev => [...prev, { ...vForm, id: Date.now(), unit: Number(vForm.unit), type: "resident", registered: new Date().toISOString().slice(0, 7).replace("-", ".") }]);
    setVForm({ plate: "", unit: "", block: "A", owner: "", spot: "", color: "", model: "" });
    setShowAddVehicle(false);
  };

  const removeVehicle = (id) => setVehicles(prev => prev.filter(v => v.id !== id));

  const addGuest = () => {
    if (!gForm.plate || !gForm.hostUnit) return;
    const now = new Date();
    const entry = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
    setGuests(prev => [{ ...gForm, id: Date.now(), hostUnit: Number(gForm.hostUnit), entryTime: entry, exitTime: null, allowedHours: Number(gForm.allowedHours) || freeHours, status: "active", overtimeHours: 0, overtimeFee: 0 }, ...prev]);
    setGForm({ plate: "", visitor: "", hostUnit: "", hostName: "", allowedHours: freeHours });
    setShowAddGuest(false);
  };

  const exitGuest = (id) => {
    setGuests(prev => prev.map(g => {
      if (g.id !== id) return g;
      const now = new Date();
      const exit = `${now.getFullYear()}.${String(now.getMonth()+1).padStart(2,"0")}.${String(now.getDate()).padStart(2,"0")} ${String(now.getHours()).padStart(2,"0")}:${String(now.getMinutes()).padStart(2,"0")}`;
      // Calculate overtime
      const entryDate = new Date(g.entryTime.replace(/\./g, "-").replace(" ", "T"));
      const diffHours = Math.max(0, (now - entryDate) / (1000 * 60 * 60) - g.allowedHours);
      const otHours = Math.ceil(diffHours);
      const otFee = otHours > 0 ? otHours * overtimeRate : 0;
      return { ...g, exitTime: exit, status: otHours > 0 ? "overtime" : "exited", overtimeHours: otHours, overtimeFee: otFee };
    }));
  };

  const isPlateRegistered = (plate) => vehicles.some(v => v.plate.replace(/\s/g, "") === plate.replace(/\s/g, ""));

  const filteredVehicles = vehicles.filter(v => !search || v.plate.includes(search.toUpperCase()) || v.owner.includes(search) || String(v.unit).includes(search));

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Sub tabs */}
      <div style={{ display: "flex", gap: 6, marginBottom: 14 }}>
        {[
          { id: "vehicles", icon: "🚗", label: "Машинууд" },
          { id: "guests", icon: "🎫", label: "Зочин" },
          { id: "gate", icon: "🚧", label: "Хаалт" },
          { id: "settings", icon: "⚙️", label: "Тохиргоо" },
        ].map(t => (
          <button key={t.id} onClick={() => setTab(t.id)} style={{
            flex: 1, padding: "10px 6px", borderRadius: 10, border: tab === t.id ? `2px solid ${accent}` : "2px solid #E2E8F0",
            background: tab === t.id ? `${accent}10` : "#F8FAFC", cursor: "pointer",
            fontSize: 11, fontWeight: 600, color: tab === t.id ? accent : "#64748B", transition: "all 0.2s",
          }}>{t.icon} {t.label}</button>
        ))}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: 6, marginBottom: 14 }}>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: accent }}>{usedSpots}/{totalSpots}</div>
          <div style={{ fontSize: 9, color: "#94A3B8" }}>Зогсоол</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#22C55E" }}>{vehicles.length}</div>
          <div style={{ fontSize: 9, color: "#94A3B8" }}>Бүртгэлтэй</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#F59E0B" }}>{activeGuests}</div>
          <div style={{ fontSize: 9, color: "#94A3B8" }}>Зочин</div>
        </div>
        <div style={{ ...S.card, margin: 0, textAlign: "center", padding: 10 }}>
          <div style={{ fontSize: 18, fontWeight: 800, color: "#EF4444" }}>{fmt(totalOvertimeFee)}</div>
          <div style={{ fontSize: 9, color: "#94A3B8" }}>Хэтрэлт</div>
        </div>
      </div>

      {/* === VEHICLES TAB === */}
      {tab === "vehicles" && (
        <div>
          <div style={{ display: "flex", gap: 8, marginBottom: 12 }}>
            <input value={search} onChange={e => setSearch(e.target.value)} placeholder="🔍 Дугаар, нэр, тоот..." style={{ ...S.input, flex: 1 }} />
          </div>
          <button onClick={() => setShowAddVehicle(true)} style={{ ...S.btn(accent), marginBottom: 14, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🚗 Машин бүртгэх
          </button>

          {filteredVehicles.map(v => (
            <div key={v.id} style={{ ...S.card, margin: "0 0 8px", padding: 14, cursor: "pointer" }} onClick={() => setViewVehicle(v)}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{
                  background: "#F1F5F9", borderRadius: 10, padding: "8px 12px",
                  fontWeight: 800, fontSize: 14, fontFamily: "monospace", letterSpacing: 1,
                  border: "2px solid #E2E8F0",
                }}>
                  {v.plate}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 700, fontSize: 13 }}>{v.owner}</div>
                  <div style={{ fontSize: 11, color: "#94A3B8" }}>{v.block}-{v.unit} · {v.model} · {v.color}</div>
                </div>
                <div style={{
                  background: `${accent}10`, borderRadius: 8, padding: "4px 10px",
                  fontSize: 12, fontWeight: 700, color: accent,
                }}>{v.spot}</div>
              </div>
            </div>
          ))}

          {/* View Vehicle Modal */}
          {viewVehicle && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setViewVehicle(null)}>
              <div style={{ background: "#fff", borderRadius: 20, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)", overflow: "hidden" }} onClick={e => e.stopPropagation()}>
                <div style={{ background: `linear-gradient(135deg, ${accent}, ${accent}CC)`, padding: 24, color: "#fff", textAlign: "center" }}>
                  <div style={{ fontSize: 32, fontWeight: 900, fontFamily: "monospace", letterSpacing: 2, marginBottom: 8 }}>{viewVehicle.plate}</div>
                  <div style={{ fontSize: 14, opacity: 0.8 }}>{viewVehicle.owner} · {viewVehicle.block}-{viewVehicle.unit}</div>
                </div>
                <div style={{ padding: 20 }}>
                  {[
                    { icon: "🚗", label: "Загвар", value: viewVehicle.model },
                    { icon: "🎨", label: "Өнгө", value: viewVehicle.color },
                    { icon: "🅿️", label: "Зогсоол", value: viewVehicle.spot },
                    { icon: "📅", label: "Бүртгэсэн", value: viewVehicle.registered },
                  ].map(i => (
                    <div key={i.label} style={{ display: "flex", padding: "10px 0", borderBottom: "1px solid #F5F5F5" }}>
                      <span style={{ width: 28 }}>{i.icon}</span>
                      <span style={{ flex: 1, fontSize: 12, color: "#94A3B8" }}>{i.label}</span>
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{i.value || "-"}</span>
                    </div>
                  ))}
                </div>
                <div style={{ padding: "0 20px 20px", display: "flex", gap: 10 }}>
                  <button onClick={() => setViewVehicle(null)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Хаах</button>
                  <button onClick={() => { removeVehicle(viewVehicle.id); setViewVehicle(null); }} style={{ ...S.btn("#EF4444"), flex: 1, fontSize: 13 }}>🗑 Устгах</button>
                </div>
              </div>
            </div>
          )}

          {/* Add Vehicle Modal */}
          {showAddVehicle && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowAddVehicle(false)}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>🚗 Машин бүртгэх</div>
                {[
                  { key: "plate", label: "Улсын дугаар *", placeholder: "УБА 1234" },
                  { key: "owner", label: "Эзэмшигч", placeholder: "Нэр" },
                  { key: "model", label: "Загвар", placeholder: "Prius" },
                  { key: "color", label: "Өнгө", placeholder: "Цагаан" },
                  { key: "spot", label: "Зогсоолын дугаар", placeholder: "#12" },
                ].map(f => (
                  <div key={f.key} style={{ marginBottom: 10 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4, color: "#374151" }}>{f.label}</div>
                    <input value={vForm[f.key]} onChange={e => setVForm(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={S.input} />
                  </div>
                ))}
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Блок</div>
                    <select value={vForm.block} onChange={e => setVForm(p => ({ ...p, block: e.target.value }))} style={S.input}>
                      <option value="A">A</option><option value="B">B</option>
                    </select>
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Тоот *</div>
                    <input value={vForm.unit} onChange={e => setVForm(p => ({ ...p, unit: e.target.value }))} placeholder="45" type="number" style={S.input} />
                  </div>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowAddVehicle(false)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Болих</button>
                  <button onClick={addVehicle} style={{ ...S.btn(accent), flex: 1 }}>Бүртгэх</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === GUESTS TAB === */}
      {tab === "guests" && (
        <div>
          <button onClick={() => setShowAddGuest(true)} style={{ ...S.btn("#F59E0B"), marginBottom: 14, fontSize: 12, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
            🎫 Зочин нэвтрүүлэх
          </button>

          {/* Active */}
          {guests.filter(g => g.status === "active").length > 0 && (
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: "#F59E0B" }}>🟡 Дотор байгаа</div>
          )}
          {guests.filter(g => g.status === "active").map(g => {
            const entry = new Date(g.entryTime.replace(/\./g, "-").replace(" ", "T"));
            const now = new Date();
            const elapsed = Math.max(0, (now - entry) / (1000 * 60 * 60));
            const remaining = Math.max(0, g.allowedHours - elapsed);
            const isOvertime = remaining === 0;
            return (
              <div key={g.id} style={{ ...S.card, margin: "0 0 8px", padding: 14, border: isOvertime ? "2px solid #EF4444" : "1px solid rgba(0,0,0,0.04)" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                  <div style={{ background: "#FEF3C7", borderRadius: 8, padding: "6px 10px", fontWeight: 800, fontSize: 13, fontFamily: "monospace" }}>{g.plate}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13 }}>{g.visitor || "Зочин"}</div>
                    <div style={{ fontSize: 11, color: "#94A3B8" }}>{g.hostName} · {g.hostUnit} тоот</div>
                  </div>
                  {isOvertime && <span style={S.badge("#EF4444", "#FEE2E2")}>⏰ Хэтэрсэн</span>}
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 8 }}>
                  <div style={{ flex: 1, height: 6, background: "#F1F5F9", borderRadius: 3, overflow: "hidden" }}>
                    <div style={{ width: `${Math.min(100, (elapsed / g.allowedHours) * 100)}%`, height: "100%", background: isOvertime ? "#EF4444" : "#F59E0B", borderRadius: 3, transition: "width 0.5s" }} />
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 600, color: isOvertime ? "#EF4444" : "#64748B" }}>
                    {isOvertime ? `+${Math.ceil(elapsed - g.allowedHours)} цаг` : `${Math.ceil(remaining)} цаг үлдсэн`}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8 }}>
                  <div style={{ flex: 1, fontSize: 11, color: "#94A3B8" }}>Орсон: {g.entryTime}</div>
                  <button onClick={() => exitGuest(g.id)} style={{ ...S.btn(isOvertime ? "#EF4444" : "#22C55E"), padding: "6px 14px", fontSize: 11, width: "auto" }}>
                    {isOvertime ? "⏰ Гаргах + Төлбөр" : "✓ Гаргах"}
                  </button>
                </div>
              </div>
            );
          })}

          {/* History */}
          {guests.filter(g => g.status !== "active").length > 0 && (
            <div style={{ fontSize: 13, fontWeight: 700, margin: "16px 0 8px", color: "#64748B" }}>📋 Түүх</div>
          )}
          {guests.filter(g => g.status !== "active").map(g => (
            <div key={g.id} style={{ ...S.card, margin: "0 0 8px", padding: 12, opacity: 0.8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                <div style={{ background: "#F1F5F9", borderRadius: 8, padding: "4px 8px", fontWeight: 700, fontSize: 11, fontFamily: "monospace" }}>{g.plate}</div>
                <div style={{ flex: 1, fontSize: 12 }}>{g.visitor || "Зочин"} → {g.hostUnit} тоот</div>
                {g.status === "overtime" ? (
                  <span style={S.badge("#EF4444", "#FEE2E2")}>+{fmt(g.overtimeFee)}</span>
                ) : (
                  <span style={S.badge("#22C55E", "#DCFCE7")}>✓</span>
                )}
              </div>
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>{g.entryTime} → {g.exitTime}</div>
            </div>
          ))}

          {/* Add Guest Modal */}
          {showAddGuest && (
            <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center", padding: 16 }} onClick={() => setShowAddGuest(false)}>
              <div style={{ background: "#fff", borderRadius: 20, padding: 24, maxWidth: 380, width: "100%", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }} onClick={e => e.stopPropagation()}>
                <div style={{ fontSize: 18, fontWeight: 800, marginBottom: 16 }}>🎫 Зочин нэвтрүүлэх</div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Машины дугаар *</div>
                  <input value={gForm.plate} onChange={e => setGForm(p => ({ ...p, plate: e.target.value }))} placeholder="УБЦ 7777" style={S.input} />
                  {gForm.plate && isPlateRegistered(gForm.plate) && (
                    <div style={{ fontSize: 11, color: "#22C55E", marginTop: 4 }}>✓ Бүртгэлтэй машин — автомат нэвтрэнэ</div>
                  )}
                </div>
                <div style={{ marginBottom: 10 }}>
                  <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Зочны нэр</div>
                  <input value={gForm.visitor} onChange={e => setGForm(p => ({ ...p, visitor: e.target.value }))} placeholder="Зочны нэр" style={S.input} />
                </div>
                <div style={{ display: "flex", gap: 10, marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Хэний зочин (тоот) *</div>
                    <input value={gForm.hostUnit} onChange={e => setGForm(p => ({ ...p, hostUnit: e.target.value }))} placeholder="45" type="number" style={S.input} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Үнэгүй хугацаа</div>
                    <select value={gForm.allowedHours} onChange={e => setGForm(p => ({ ...p, allowedHours: Number(e.target.value) }))} style={S.input}>
                      {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h} цаг</option>)}
                    </select>
                  </div>
                </div>
                <div style={{ background: "#FEF3C7", borderRadius: 10, padding: 12, marginBottom: 14, fontSize: 11, color: "#92400E" }}>
                  ⏰ {gForm.allowedHours || freeHours} цагаас хэтэрвэл цагт {fmt(overtimeRate)} төлбөр → тухайн тоотын сарын төлбөр дээр нэмэгдэнэ
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <button onClick={() => setShowAddGuest(false)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Болих</button>
                  <button onClick={addGuest} style={{ ...S.btn("#F59E0B"), flex: 1 }}>🎫 Нэвтрүүлэх</button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* === GATE TAB === */}
      {tab === "gate" && (
        <div>
          <div style={{ ...S.card, margin: "0 0 14px", textAlign: "center" }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>{gateConnected ? "🟢" : "🔴"}</div>
            <div style={{ fontSize: 16, fontWeight: 800, marginBottom: 4 }}>{gateConnected ? "Хаалт холбогдсон" : "Хаалт холбогдоогүй"}</div>
            <div style={{ fontSize: 12, color: "#94A3B8" }}>{gateConnected ? `${gateBrand} · ${gateIP}` : "Хаалтны төхөөрөмжтэй холбоно уу"}</div>
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>🔗 Хаалтны төхөөрөмж холбох</div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Үйлдвэрлэгч</div>
              <select value={gateBrand} onChange={e => setGateBrand(e.target.value)} style={S.input}>
                <option value="">-- Сонгох --</option>
                <option value="ZKTeco">ZKTeco (LPR камер)</option>
                <option value="Dahua">Dahua (ANPR)</option>
                <option value="Hikvision">Hikvision (LPR)</option>
                <option value="CAME">CAME (Barrier)</option>
                <option value="FAAC">FAAC (Barrier)</option>
                <option value="BFT">BFT (Barrier)</option>
                <option value="Nice">Nice (Barrier)</option>
                <option value="custom">Бусад / Custom API</option>
              </select>
            </div>
            <div style={{ marginBottom: 10 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>IP хаяг / API endpoint</div>
              <input value={gateIP} onChange={e => setGateIP(e.target.value)} placeholder="192.168.1.100 эсвэл https://api.gate.mn" style={S.input} />
            </div>
            <button onClick={() => setGateConnected(!gateConnected)} style={{ ...S.btn(gateConnected ? "#EF4444" : "#22C55E"), fontSize: 13 }}>
              {gateConnected ? "🔌 Салгах" : "🔗 Холбох"}
            </button>
          </div>

          <div style={{ ...S.card, margin: "0 0 14px", background: "#EFF6FF", border: "1px solid #BFDBFE" }}>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF", marginBottom: 8 }}>ℹ️ Хэрхэн ажилладаг</div>
            <div style={{ fontSize: 11, color: "#1E40AF", lineHeight: 1.7 }}>
              1. LPR камер машины дугаарыг автомат таньна<br/>
              2. Бүртгэлтэй машин → хаалт автомат нээгдэнэ<br/>
              3. Зочин → хаалт дээр мэдэгдэл → харуул зөвшөөрнө<br/>
              4. Хугацаа хэтэрсэн → гарах үед автомат тооцоолно<br/>
              5. Нэмэлт төлбөр → тухайн тоотын сарын нэхэмжлэх дээр
            </div>
          </div>

          <div style={{ ...S.card, margin: 0 }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8 }}>📡 API интеграц</div>
            <div style={{ background: "#0F172A", borderRadius: 10, padding: 14, fontFamily: "monospace", fontSize: 10, color: "#22C55E", lineHeight: 1.8, overflowX: "auto" }}>
              POST /api/gate/check<br/>
              {"{"} "plate": "УБА 1234" {"}"}<br/><br/>
              Response:<br/>
              {"{"} "allowed": true, "type": "resident",<br/>
              &nbsp;&nbsp;"unit": 45, "spot": "#12" {"}"}
            </div>
          </div>
        </div>
      )}

      {/* === SETTINGS TAB === */}
      {tab === "settings" && (
        <div>
          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>💰 Зочны зогсоолын төлбөр</div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Үнэгүй зогсох хугацаа</div>
              <select value={freeHours} onChange={e => setFreeHours(Number(e.target.value))} style={S.input}>
                {[1, 2, 3, 4, 5, 6, 8, 12, 24].map(h => <option key={h} value={h}>{h} цаг</option>)}
              </select>
            </div>
            <div style={{ marginBottom: 12 }}>
              <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>Хэтрэлтийн цагийн төлбөр</div>
              <input value={overtimeRate} onChange={e => setOvertimeRate(Number(e.target.value))} type="number" style={S.input} />
              <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>Цагт {fmt(overtimeRate)}</div>
            </div>
          </div>

          <div style={{ ...S.card, margin: "0 0 14px" }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>📊 Жишээ тооцоо</div>
            <div style={{ fontSize: 12, color: "#64748B", lineHeight: 1.8 }}>
              Зочин {freeHours} цаг үнэгүй зогсоно.<br/>
              {freeHours + 1} цаг зогсвол → {fmt(overtimeRate * 1)} нэмэлт<br/>
              {freeHours + 3} цаг зогсвол → {fmt(overtimeRate * 3)} нэмэлт<br/>
              {freeHours + 8} цаг зогсвол → {fmt(overtimeRate * 8)} нэмэлт<br/><br/>
              Нэмэлт төлбөр тухайн айлын <strong>сарын нэхэмжлэх</strong> дээр автомат нэмэгдэнэ.
            </div>
          </div>

          <div style={{ ...S.card, margin: 0 }}>
            <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>🅿️ Нийт зогсоолын тоо</div>
            <input value={totalSpots} disabled style={{ ...S.input, background: "#F1F5F9" }} />
            <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 4 }}>Тохиргоо хэсгээс өөрчилнө</div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ШИЛЭН ТАЙЛАН ─── */
function ShilenReport({ org, accent }) {
  const [selectedMonth, setSelectedMonth] = useState("2026.03");
  const [selectedBlock, setSelectedBlock] = useState("all");
  const [fbConnected, setFbConnected] = useState(false);
  const [fbPageName, setFbPageName] = useState("");
  const [fbPageId, setFbPageId] = useState("");
  const [autoPost, setAutoPost] = useState(false);
  const [autoDay, setAutoDay] = useState("5");
  const [autoTime, setAutoTime] = useState("10:00");
  const [generating, setGenerating] = useState(false);
  const [generated, setGenerated] = useState({});
  const [posting, setPosting] = useState(null);
  const [posted, setPosted] = useState({});
  const [showFbSetup, setShowFbSetup] = useState(false);
  const [showPreview, setShowPreview] = useState(null);
  const canvasRef = useRef(null);

  const MONTHS = ["2026.03", "2026.02", "2026.01"];
  const BLOCKS = [
    { id: "all", label: "Бүх байр" },
    { id: "A", label: "A блок" },
    { id: "B", label: "B блок" },
  ];

  const blockUnits = selectedBlock === "all" ? UNITS : UNITS.filter(u => u.block === selectedBlock);
  const totalIncome = blockUnits.filter(u => u.paid).length * 80000;
  const totalExpense = selectedBlock === "all"
    ? EXPENSES.reduce((s, e) => s + e.amount, 0)
    : Math.round(EXPENSES.reduce((s, e) => s + e.amount, 0) * (blockUnits.length / UNITS.length));
  const paidCount = blockUnits.filter(u => u.paid).length;
  const unpaidCount = blockUnits.filter(u => !u.paid).length;
  const balance = totalIncome - totalExpense;

  const generateImage = (block) => {
    setGenerating(true);
    setTimeout(() => {
      setGenerated(prev => ({ ...prev, [`${selectedMonth}-${block}`]: true }));
      setGenerating(false);
    }, 1500);
  };

  const postToFb = (block) => {
    setPosting(block);
    setTimeout(() => {
      setPosted(prev => ({ ...prev, [`${selectedMonth}-${block}`]: true }));
      setPosting(null);
    }, 2000);
  };

  const handleFbConnect = () => {
    if (!fbPageName.trim()) return;
    setFbConnected(true);
    setShowFbSetup(false);
  };

  const renderReportCard = (blockId, blockLabel) => {
    const bUnits = blockId === "all" ? UNITS : UNITS.filter(u => u.block === blockId);
    const bIncome = bUnits.filter(u => u.paid).length * 80000;
    const bExpenses = blockId === "all"
      ? EXPENSES.reduce((s, e) => s + e.amount, 0)
      : Math.round(EXPENSES.reduce((s, e) => s + e.amount, 0) * (bUnits.length / UNITS.length));
    const bBalance = bIncome - bExpenses;
    const bPaid = bUnits.filter(u => u.paid).length;
    const bUnpaid = bUnits.filter(u => !u.paid).length;
    const key = `${selectedMonth}-${blockId}`;
    const isGenerated = generated[key];
    const isPosted = posted[key];

    return (
      <div key={blockId} style={{ ...S.card, margin: "0 0 16px", padding: 0, overflow: "hidden" }}>
        {/* Report Image Preview */}
        <div style={{
          background: `linear-gradient(135deg, ${accent} 0%, ${accent}DD 50%, ${accent}99 100%)`,
          padding: 24, color: "#fff", position: "relative",
        }}>
          <div style={{
            position: "absolute", top: 0, right: 0, width: 120, height: 120,
            background: "rgba(255,255,255,0.05)", borderRadius: "0 0 0 100%",
          }} />

          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
            {org?.logo ? (
              <img src={org.logo} alt="" style={{ width: 32, height: 32, borderRadius: 6, objectFit: "contain", background: "#fff", padding: 2 }} />
            ) : (
              <div style={{ width: 32, height: 32, borderRadius: 6, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏢</div>
            )}
            <div>
              <div style={{ fontSize: 13, fontWeight: 800 }}>{org?.name || "СӨХ"}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>Шилэн тайлан</div>
            </div>
            <div style={{ marginLeft: "auto", textAlign: "right" }}>
              <div style={{ fontSize: 16, fontWeight: 800 }}>{blockLabel}</div>
              <div style={{ fontSize: 10, opacity: 0.7 }}>{selectedMonth}</div>
            </div>
          </div>

          {/* Stats Grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 12 }}>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Орлого</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{fmt(bIncome)}</div>
            </div>
            <div style={{ background: "rgba(255,255,255,0.12)", borderRadius: 10, padding: "10px 12px" }}>
              <div style={{ fontSize: 9, opacity: 0.7, textTransform: "uppercase", letterSpacing: 1 }}>Зарлага</div>
              <div style={{ fontSize: 18, fontWeight: 800, marginTop: 4 }}>{fmt(bExpenses)}</div>
            </div>
          </div>

          {/* Balance */}
          <div style={{
            background: bBalance >= 0 ? "rgba(34,197,94,0.2)" : "rgba(239,68,68,0.2)",
            borderRadius: 10, padding: "10px 14px", display: "flex", justifyContent: "space-between", alignItems: "center",
            marginBottom: 12,
          }}>
            <span style={{ fontSize: 11, fontWeight: 600 }}>Үлдэгдэл</span>
            <span style={{ fontSize: 18, fontWeight: 800 }}>{bBalance >= 0 ? "+" : ""}{fmt(bBalance)}</span>
          </div>

          {/* Payment Status */}
          <div style={{ display: "flex", gap: 8 }}>
            <div style={{ flex: 1, background: "rgba(34,197,94,0.15)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{bPaid}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>Төлсөн айл</div>
            </div>
            <div style={{ flex: 1, background: "rgba(239,68,68,0.15)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{bUnpaid}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>Өргүй айл</div>
            </div>
            <div style={{ flex: 1, background: "rgba(255,255,255,0.1)", borderRadius: 8, padding: "8px 10px", textAlign: "center" }}>
              <div style={{ fontSize: 20, fontWeight: 800 }}>{bUnits.length}</div>
              <div style={{ fontSize: 9, opacity: 0.8 }}>Нийт айл</div>
            </div>
          </div>

          {/* Expenses Breakdown */}
          <div style={{ marginTop: 12 }}>
            <div style={{ fontSize: 10, opacity: 0.7, marginBottom: 6, textTransform: "uppercase", letterSpacing: 1 }}>Зарлагын задаргаа</div>
            {EXPENSES.map(e => {
              const eAmount = blockId === "all" ? e.amount : Math.round(e.amount * (bUnits.length / UNITS.length));
              const pct = Math.round((eAmount / bExpenses) * 100);
              return (
                <div key={e.id} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4 }}>
                  <span style={{ fontSize: 12 }}>{e.icon}</span>
                  <span style={{ fontSize: 11, flex: 1 }}>{e.label}</span>
                  <div style={{ width: 60, height: 4, background: "rgba(255,255,255,0.1)", borderRadius: 2, overflow: "hidden" }}>
                    <div style={{ width: `${pct}%`, height: "100%", background: "#fff", borderRadius: 2 }} />
                  </div>
                  <span style={{ fontSize: 10, fontWeight: 700, minWidth: 70, textAlign: "right" }}>{fmt(eAmount)}</span>
                </div>
              );
            })}
          </div>

          {/* Footer */}
          <div style={{ marginTop: 14, paddingTop: 10, borderTop: "1px solid rgba(255,255,255,0.15)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <span style={{ fontSize: 9, opacity: 0.5 }}>{org?.phone || ""} · {org?.email || ""}</span>
            <span style={{ fontSize: 9, opacity: 0.5 }}>Автомат тайлан</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ padding: 14, display: "flex", gap: 8 }}>
          <button
            onClick={() => generateImage(blockId)}
            disabled={generating}
            style={{
              ...S.btn(isGenerated ? "#22C55E" : accent), flex: 1, padding: "10px 12px", fontSize: 12,
              display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
            }}
          >
            {generating ? "⏳ Үүсгэж байна..." : isGenerated ? "✓ Зураг бэлэн" : "🖼️ Зураг үүсгэх"}
          </button>

          {isGenerated && fbConnected && (
            <button
              onClick={() => postToFb(blockId)}
              disabled={posting === blockId}
              style={{
                ...S.btn(isPosted ? "#22C55E" : "#1877F2"), flex: 1, padding: "10px 12px", fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              {posting === blockId ? "⏳ Нийтэлж байна..." : isPosted ? "✓ Нийтэлсэн" : "📘 Facebook-д нийтлэх"}
            </button>
          )}

          {isGenerated && !fbConnected && (
            <button
              onClick={() => setShowFbSetup(true)}
              style={{
                ...S.btn("#1877F2"), flex: 1, padding: "10px 12px", fontSize: 12,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
              }}
            >
              📘 Facebook холбох
            </button>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ padding: 16, paddingBottom: 80 }}>
      {/* Month & Block Selector */}
      <div style={{ ...S.card, margin: "0 0 12px" }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>📅 Сар сонгох</div>
        <div style={{ display: "flex", gap: 8 }}>
          {MONTHS.map(m => (
            <button key={m} onClick={() => setSelectedMonth(m)} style={{
              flex: 1, padding: "10px 8px", borderRadius: 10, border: selectedMonth === m ? `2px solid ${accent}` : "2px solid #E2E8F0",
              background: selectedMonth === m ? `${accent}10` : "#F8FAFC", cursor: "pointer",
              fontSize: 13, fontWeight: 600, color: selectedMonth === m ? accent : "#64748B", transition: "all 0.2s",
            }}>{m}</button>
          ))}
        </div>
      </div>

      {/* Facebook Connection Status */}
      <div style={{ ...S.card, margin: "0 0 16px", background: fbConnected ? "#F0FDF4" : "#FFF7ED", border: fbConnected ? "1px solid #BBF7D0" : "1px solid #FED7AA" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 24 }}>📘</span>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700, color: fbConnected ? "#166534" : "#9A3412" }}>
                {fbConnected ? "Facebook холбогдсон" : "Facebook холбогдоогүй"}
              </div>
              {fbConnected && <div style={{ fontSize: 11, color: "#16A34A", marginTop: 2 }}>📄 {fbPageName}</div>}
            </div>
          </div>
          <button onClick={() => setShowFbSetup(true)} style={{
            background: fbConnected ? "#DCFCE7" : "#FFEDD5", border: "none", borderRadius: 8,
            padding: "6px 12px", fontSize: 11, fontWeight: 600, cursor: "pointer",
            color: fbConnected ? "#166534" : "#9A3412",
          }}>
            {fbConnected ? "Тохиргоо" : "Холбох"}
          </button>
        </div>

        {/* Auto-post settings */}
        {fbConnected && (
          <div style={{ marginTop: 14, paddingTop: 14, borderTop: "1px solid #BBF7D0" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10 }}>
              <div style={{ fontSize: 13, fontWeight: 600, color: "#166534" }}>🔄 Автомат нийтлэх</div>
              <button onClick={() => setAutoPost(!autoPost)} style={{
                width: 44, height: 24, borderRadius: 12, border: "none", cursor: "pointer",
                background: autoPost ? "#22C55E" : "#D1D5DB", position: "relative", transition: "all 0.3s",
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: 9, background: "#fff",
                  position: "absolute", top: 3, left: autoPost ? 23 : 3, transition: "all 0.3s",
                  boxShadow: "0 1px 3px rgba(0,0,0,0.2)",
                }} />
              </button>
            </div>

            {autoPost && (
              <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#16A34A", marginBottom: 4 }}>Сар бүрийн</div>
                  <select value={autoDay} onChange={e => setAutoDay(e.target.value)} style={{
                    ...S.input, padding: "8px 10px", fontSize: 12, background: "#fff",
                  }}>
                    {[1,2,3,4,5,6,7,8,9,10,15,20,25].map(d => (
                      <option key={d} value={d}>{d}-ны өдөр</option>
                    ))}
                  </select>
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 10, color: "#16A34A", marginBottom: 4 }}>Цагт</div>
                  <select value={autoTime} onChange={e => setAutoTime(e.target.value)} style={{
                    ...S.input, padding: "8px 10px", fontSize: 12, background: "#fff",
                  }}>
                    {["08:00", "09:00", "10:00", "11:00", "12:00", "14:00", "16:00", "18:00"].map(t => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {autoPost && (
              <div style={{
                marginTop: 10, padding: "8px 12px", borderRadius: 8, background: "#DCFCE7",
                fontSize: 11, color: "#166534", display: "flex", alignItems: "center", gap: 6,
              }}>
                ✅ Сар бүрийн {autoDay}-нд {autoTime} цагт тайланг "{fbPageName}" хуудсанд автомат нийтэлнэ
              </div>
            )}
          </div>
        )}
      </div>

      {/* Generate Report */}
      <div style={{ marginBottom: 16 }}>
        <button onClick={() => generateImage("all")} style={{
          ...S.btn(accent), display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          fontSize: 14, padding: "14px 24px",
        }}>
          🖼️ Тайлан үүсгэх
        </button>
      </div>

      {/* Single Report Card */}
      {renderReportCard("all", org?.name || "СӨХ")}

      {/* Facebook Setup Modal */}
      {showFbSetup && (
        <div style={{
          position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
          background: "rgba(0,0,0,0.5)", zIndex: 200, display: "flex", alignItems: "center", justifyContent: "center",
          padding: 20,
        }} onClick={() => setShowFbSetup(false)}>
          <div style={{
            background: "#fff", borderRadius: 20, padding: 24, maxWidth: 380, width: "100%",
            boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
          }} onClick={e => e.stopPropagation()}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 20 }}>
              <span style={{ fontSize: 28 }}>📘</span>
              <div>
                <div style={{ fontSize: 16, fontWeight: 800 }}>Facebook холбох</div>
                <div style={{ fontSize: 12, color: "#64748B" }}>Page-ийн мэдээлэл оруулах</div>
              </div>
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Facebook Page нэр</div>
              <input value={fbPageName} onChange={e => setFbPageName(e.target.value)} placeholder="Жишээ: Блю Скай Тауэр СӨХ" style={S.input} />
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: 12, fontWeight: 600, marginBottom: 6, color: "#374151" }}>Page ID (заавал биш)</div>
              <input value={fbPageId} onChange={e => setFbPageId(e.target.value)} placeholder="Жишээ: 123456789" style={S.input} />
            </div>

            <div style={{
              background: "#EFF6FF", borderRadius: 10, padding: 12, marginBottom: 16,
              fontSize: 11, color: "#1E40AF", lineHeight: 1.5,
            }}>
              💡 <strong>Заавар:</strong> Facebook Page → Settings → Page ID хэсгээс ID-гаа олно. Автомат нийтлэхийн тулд Page Access Token шаардлагатай.
            </div>

            <div style={{ display: "flex", gap: 10 }}>
              <button onClick={() => setShowFbSetup(false)} style={{ ...S.btnOutline, flex: 1, borderRadius: 12 }}>Болих</button>
              <button onClick={handleFbConnect} style={{ ...S.btn("#1877F2"), flex: 1 }}>
                {fbConnected ? "Хадгалах" : "Холбох"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── ORG SETTINGS SCREEN ─── */
function OrgSetupScreen({ org, onSave, isFirstTime }) {
  const [name, setName] = useState(org.name);
  const [logo, setLogo] = useState(org.logo);
  const [address, setAddress] = useState(org.address);
  const [phone, setPhone] = useState(org.phone);
  const [email, setEmail] = useState(org.email);
  const [blocks, setBlocks] = useState(org.blocks);
  const [color, setColor] = useState(org.color);
  const [dragOver, setDragOver] = useState(false);

  const handleLogoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (!file || !file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => setLogo(ev.target.result);
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    if (!name.trim()) return;
    onSave({ name, logo, address, phone, email, blocks, color });
  };

  const COLORS = ["#2563EB", "#7C3AED", "#0EA5E9", "#059669", "#DC2626", "#EA580C", "#D97706", "#4F46E5"];

  return (
    <div style={{ minHeight: "100vh", background: "#F0F2F5" }}>
      <div style={{ background: `linear-gradient(135deg, ${color} 0%, ${color}CC 100%)`, padding: "28px 20px 32px", color: "#fff" }}>
        <div style={{ fontSize: 13, opacity: 0.8 }}>{isFirstTime ? "Тавтай морил! 👋" : "⚙️ Тохиргоо"}</div>
        <div style={{ fontSize: 22, fontWeight: 800, marginTop: 6 }}>
          {isFirstTime ? "Байгууллагын мэдээлэл" : "Байгууллагын тохиргоо"}
        </div>
        {isFirstTime && <div style={{ fontSize: 13, opacity: 0.7, marginTop: 6 }}>Эхлээд байгууллагынхаа мэдээллийг оруулна уу</div>}
      </div>

      {/* Logo Upload */}
      <div style={{ ...S.card, marginTop: -12 }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 14 }}>Лого</div>
        <div
          onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          style={{
            border: dragOver ? `2px dashed ${color}` : "2px dashed #E2E8F0",
            borderRadius: 16, padding: logo ? 16 : 32,
            textAlign: "center", cursor: "pointer",
            background: dragOver ? `${color}08` : "#FAFBFC",
            transition: "all 0.2s",
          }}
          onClick={() => document.getElementById("logo-input").click()}
        >
          {logo ? (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
              <img src={logo} alt="Logo" style={{ width: 100, height: 100, objectFit: "contain", borderRadius: 12 }} />
              <span style={{ fontSize: 12, color: "#64748B" }}>Дахин дарж солих</span>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 40, marginBottom: 8 }}>🏢</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: "#64748B" }}>Лого оруулах</div>
              <div style={{ fontSize: 12, color: "#94A3B8", marginTop: 4 }}>Дарах эсвэл зураг чирж оруулах</div>
              <div style={{ fontSize: 11, color: "#CBD5E1", marginTop: 4 }}>PNG, JPG, SVG</div>
            </>
          )}
          <input id="logo-input" type="file" accept="image/*" onChange={handleLogoUpload} style={{ display: "none" }} />
        </div>
      </div>

      {/* Org Name */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Байгууллагын нэр *</div>
        <input
          value={name} onChange={e => setName(e.target.value)}
          placeholder="Жишээ: Блю Скай Тауэр СӨХ"
          style={S.input}
        />
      </div>

      {/* Address */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Хаяг</div>
        <input
          value={address} onChange={e => setAddress(e.target.value)}
          placeholder="Жишээ: БЗД, 3-р хороо, Энхтайвны өргөн чөлөө 5"
          style={S.input}
        />
      </div>

      {/* Contact */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Холбоо барих</div>
        <input
          value={phone} onChange={e => setPhone(e.target.value)}
          placeholder="Утасны дугаар"
          style={{ ...S.input, marginBottom: 10 }}
        />
        <input
          value={email} onChange={e => setEmail(e.target.value)}
          placeholder="И-мэйл хаяг"
          style={S.input}
        />
      </div>

      {/* Blocks */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 10 }}>Блокуудын тоо</div>
        <input
          value={blocks} onChange={e => setBlocks(e.target.value)}
          placeholder="Жишээ: A, B, C"
          style={S.input}
        />
        <div style={{ fontSize: 11, color: "#94A3B8", marginTop: 6 }}>Таслалаар тусгаарлан бичнэ үү</div>
      </div>

      {/* Brand Color */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Брэнд өнгө</div>
        <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
          {COLORS.map(c => (
            <button key={c} onClick={() => setColor(c)} style={{
              width: 40, height: 40, borderRadius: 12, background: c, border: color === c ? "3px solid #1A1A2E" : "3px solid transparent",
              cursor: "pointer", transition: "all 0.2s", transform: color === c ? "scale(1.15)" : "scale(1)",
              boxShadow: color === c ? `0 4px 12px ${c}44` : "none",
            }} />
          ))}
        </div>
      </div>

      {/* Preview */}
      <div style={{ ...S.card }}>
        <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 12 }}>Урьдчилан харах</div>
        <div style={{
          background: `linear-gradient(135deg, ${color}, ${color}CC)`, borderRadius: 14,
          padding: 20, color: "#fff", display: "flex", alignItems: "center", gap: 14,
        }}>
          {logo ? (
            <img src={logo} alt="" style={{ width: 48, height: 48, borderRadius: 10, objectFit: "contain", background: "#fff", padding: 4 }} />
          ) : (
            <div style={{ width: 48, height: 48, borderRadius: 10, background: "rgba(255,255,255,0.2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22 }}>🏢</div>
          )}
          <div>
            <div style={{ fontWeight: 800, fontSize: 16 }}>{name || "Байгууллагын нэр"}</div>
            {address && <div style={{ fontSize: 11, opacity: 0.8, marginTop: 2 }}>{address}</div>}
          </div>
        </div>
      </div>

      {/* Save */}
      <div style={{ padding: "0 16px 32px" }}>
        <button onClick={handleSave} style={{
          ...S.btn(name.trim() ? color : "#94A3B8"),
          fontSize: 16, padding: "16px 24px",
        }}>
          {isFirstTime ? "Эхлүүлэх 🚀" : "Хадгалах ✓"}
        </button>
      </div>
    </div>
  );
}

/* ─── AUTH / ONBOARDING SCREENS ─── */

function WelcomeScreen({ onLogin, onRegister }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  return (
    <div style={{
      minHeight: "100vh", background: "linear-gradient(160deg, #0F172A 0%, #1E3A5F 50%, #2563EB 100%)",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24, fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
      opacity: mounted ? 1 : 0, transition: "opacity 0.6s ease",
    }}>
      {/* Logo / Icon */}
      <div style={{
        width: 90, height: 90, borderRadius: 28, background: "rgba(255,255,255,0.12)",
        backdropFilter: "blur(20px)", display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 44, marginBottom: 28, boxShadow: "0 8px 32px rgba(0,0,0,0.2)",
        border: "1px solid rgba(255,255,255,0.15)",
        animation: "welcomePulse 3s ease-in-out infinite",
      }}>🏢</div>

      <div style={{
        fontSize: 32, fontWeight: 900, color: "#fff", textAlign: "center",
        letterSpacing: -0.5, marginBottom: 8,
      }}>СӨХ Апп</div>
      <div style={{
        fontSize: 14, color: "rgba(255,255,255,0.6)", textAlign: "center",
        maxWidth: 280, lineHeight: 1.5, marginBottom: 48,
      }}>
        Сууц өмчлөгчдийн холбооны ухаалаг менежмент систем
      </div>

      {/* Feature highlights */}
      <div style={{ display: "flex", gap: 16, marginBottom: 48, flexWrap: "wrap", justifyContent: "center" }}>
        {[
          { icon: "💳", label: "Төлбөр" },
          { icon: "📝", label: "Хүсэлт" },
          { icon: "📢", label: "Зарлал" },
          { icon: "⚡", label: "Хэрэглээ" },
        ].map((f, i) => (
          <div key={f.label} style={{
            display: "flex", flexDirection: "column", alignItems: "center", gap: 6,
            opacity: mounted ? 1 : 0, transform: mounted ? "translateY(0)" : "translateY(20px)",
            transition: `all 0.5s ease ${0.2 + i * 0.1}s`,
          }}>
            <div style={{
              width: 52, height: 52, borderRadius: 16, background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22,
              border: "1px solid rgba(255,255,255,0.08)",
            }}>{f.icon}</div>
            <span style={{ fontSize: 10, color: "rgba(255,255,255,0.5)", fontWeight: 600 }}>{f.label}</span>
          </div>
        ))}
      </div>

      {/* Buttons */}
      <div style={{ width: "100%", maxWidth: 340 }}>
        <button onClick={onRegister} style={{
          width: "100%", padding: "16px 24px", borderRadius: 14, border: "none",
          background: "#fff", color: "#0F172A", fontSize: 16, fontWeight: 700,
          cursor: "pointer", marginBottom: 12,
          boxShadow: "0 4px 20px rgba(0,0,0,0.15)",
          transition: "all 0.2s",
        }}>
          Бүртгүүлэх
        </button>
        <button onClick={onLogin} style={{
          width: "100%", padding: "16px 24px", borderRadius: 14,
          border: "2px solid rgba(255,255,255,0.25)", background: "rgba(255,255,255,0.06)",
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
          transition: "all 0.2s",
        }}>
          Нэвтрэх
        </button>
      </div>

      <div style={{ marginTop: 32, fontSize: 11, color: "rgba(255,255,255,0.3)" }}>
        v1.0 · Powered by СӨХ Апп
      </div>

      <style>{`
        @keyframes welcomePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 8px 32px rgba(0,0,0,0.2); }
          50% { transform: scale(1.05); box-shadow: 0 12px 40px rgba(37,99,235,0.3); }
        }
      `}</style>
    </div>
  );
}

function LoginScreen({ onBack, onSuccess }) {
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    if (!phone.trim() || !password.trim()) {
      setError("Утасны дугаар болон нууц үг оруулна уу");
      return;
    }
    if (phone.length < 8) {
      setError("Утасны дугаар 8 оронтой байна");
      return;
    }
    setLoading(true);
    setError("");
    // Simulate login
    setTimeout(() => {
      setLoading(false);
      onSuccess({ phone, name: "Бат-Эрдэнэ" });
    }, 1200);
  };

  return (
    <div style={{
      minHeight: "100vh", background: "#F0F2F5",
      fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
        padding: "20px 20px 32px", color: "#fff",
      }}>
        <button onClick={onBack} style={{
          background: "none", border: "none", color: "#fff", fontSize: 18,
          cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 6,
        }}>← Буцах</button>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Нэвтрэх</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>Бүртгэлтэй утасны дугаараар нэвтэрнэ үү</div>
      </div>

      <div style={{ padding: "24px 16px" }}>
        {/* Phone */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
        }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
            📱 Утасны дугаар
          </label>
          <input
            type="tel"
            value={phone}
            onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }}
            placeholder="99112233"
            maxLength={8}
            style={{
              width: "100%", padding: "14px 16px", borderRadius: 12,
              border: "1.5px solid #E2E8F0", fontSize: 18, fontWeight: 700,
              outline: "none", boxSizing: "border-box", background: "#F8FAFC",
              letterSpacing: 2, transition: "border 0.2s",
            }}
          />
        </div>

        {/* Password */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
          boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
        }}>
          <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
            🔒 Нууц үг
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={e => { setPassword(e.target.value); setError(""); }}
              onKeyDown={e => { if (e.key === "Enter") handleLogin(); }}
              placeholder="Нууц үг"
              style={{
                width: "100%", padding: "14px 48px 14px 16px", borderRadius: 12,
                border: "1.5px solid #E2E8F0", fontSize: 16,
                outline: "none", boxSizing: "border-box", background: "#F8FAFC",
                transition: "border 0.2s",
              }}
            />
            <button onClick={() => setShowPassword(!showPassword)} style={{
              position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
              background: "none", border: "none", cursor: "pointer", fontSize: 18, padding: 4,
            }}>
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", borderRadius: 12, padding: "12px 16px",
            marginBottom: 12, fontSize: 13, color: "#991B1B", fontWeight: 500,
            border: "1px solid #FECACA",
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Login Button */}
        <button onClick={handleLogin} disabled={loading} style={{
          width: "100%", padding: "16px 24px", borderRadius: 14, border: "none",
          background: loading ? "#94A3B8" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.2s",
        }}>
          {loading ? (
            <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span> Нэвтэрж байна...</>
          ) : "Нэвтрэх"}
        </button>

        {/* Forgot password */}
        <button style={{
          display: "block", margin: "16px auto 0", background: "none", border: "none",
          color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer",
        }}>
          Нууц үг мартсан?
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}


/* ─── LOCATION DATA (Хот → Дүүрэг → Хороо → СӨХ) ─── */
const LOCATION_DATA = {
  "Улаанбаатар": {
    "Баянзүрх": {
      "1-р хороо": [
        { id: "bz1-1", name: "Нарантуул СӨХ", address: "Нарантуул орчим, 1-р хороо", buildings: 4, units: 180, verified: true },
        { id: "bz1-2", name: "Баянзүрх цогцолбор СӨХ", address: "Баянзүрх 1-р хороо", buildings: 3, units: 120, verified: true },
      ],
      "3-р хороо": [
        { id: "bz3-1", name: "Хангай ордон СӨХ", address: "13-р хороолол", buildings: 6, units: 280, verified: true },
        { id: "bz3-2", name: "Шинэ хороолол СӨХ", address: "13-р хороолол, 3-р хороо", buildings: 2, units: 96, verified: false },
      ],
      "5-р хороо": [
        { id: "bz5-1", name: "Алтан гадас СӨХ", address: "Баянзүрх 5-р хороо", buildings: 5, units: 220, verified: true },
        { id: "bz5-2", name: "Хан-Уул харш СӨХ", address: "5-р хороо, 7-р байр", buildings: 3, units: 144, verified: true },
        { id: "bz5-3", name: "Ирээдүй СӨХ", address: "5-р хороо, шинэ суурьшил", buildings: 2, units: 80, verified: false },
      ],
      "12-р хороо": [
        { id: "bz12-1", name: "Амгалан СӨХ", address: "Амгалан, 12-р хороо", buildings: 4, units: 160, verified: true },
        { id: "bz12-2", name: "Дэнжийн мянга СӨХ", address: "12-р хороо, 44-р байр", buildings: 2, units: 90, verified: true },
      ],
      "20-р хороо": [
        { id: "bz20-1", name: "Зайсан парк СӨХ", address: "Зайсан, 20-р хороо", buildings: 3, units: 150, verified: true },
        { id: "bz20-2", name: "Тэнгэр СӨХ", address: "20-р хороо, 15-р байр", buildings: 2, units: 72, verified: false },
      ],
    },
    "Сүхбаатар": {
      "1-р хороо": [
        { id: "sb1-1", name: "Төв СӨХ", address: "Сүхбаатар 1-р хороо", buildings: 3, units: 140, verified: true },
        { id: "sb1-2", name: "Их сургууль СӨХ", address: "1-р хороо, МУИС орчим", buildings: 2, units: 88, verified: true },
      ],
      "4-р хороо": [
        { id: "sb4-1", name: "Сансар СӨХ", address: "Сансар, 4-р хороо", buildings: 5, units: 240, verified: true },
        { id: "sb4-2", name: "Номин СӨХ", address: "4-р хороо, 20-р байр", buildings: 3, units: 130, verified: true },
      ],
      "7-р хороо": [
        { id: "sb7-1", name: "Бэлх СӨХ", address: "7-р хороо, 11-р хороолол", buildings: 4, units: 192, verified: true },
      ],
      "11-р хороо": [
        { id: "sb11-1", name: "Жуков СӨХ", address: "Жуков, 11-р хороо", buildings: 6, units: 300, verified: true },
        { id: "sb11-2", name: "Тулга СӨХ", address: "11-р хороо, 28-р байр", buildings: 2, units: 96, verified: false },
      ],
    },
    "Хан-Уул": {
      "1-р хороо": [
        { id: "hu1-1", name: "Яармаг СӨХ", address: "Яармаг, 1-р хороо", buildings: 4, units: 200, verified: true },
      ],
      "3-р хороо": [
        { id: "hu3-1", name: "Нисэх СӨХ", address: "Нисэх, 3-р хороо", buildings: 5, units: 260, verified: true },
        { id: "hu3-2", name: "Ривер гарден СӨХ", address: "3-р хороо, голын эрэг", buildings: 3, units: 144, verified: true },
      ],
      "5-р хороо": [
        { id: "hu5-1", name: "Зайсан хилл СӨХ", address: "Зайсан, 5-р хороо", buildings: 4, units: 180, verified: true },
        { id: "hu5-2", name: "Нуур СӨХ", address: "5-р хороо, нуурын орчим", buildings: 2, units: 100, verified: false },
      ],
      "11-р хороо": [
        { id: "hu11-1", name: "Мөнгөн алт СӨХ", address: "11-р хороо, Хан-Уул", buildings: 3, units: 132, verified: true },
      ],
    },
    "Баянгол": {
      "2-р хороо": [
        { id: "bg2-1", name: "Энх тайван СӨХ", address: "Баянгол, 2-р хороо", buildings: 5, units: 250, verified: true },
        { id: "bg2-2", name: "Ногоон нуур СӨХ", address: "2-р хороо, 5-р байр", buildings: 3, units: 120, verified: true },
      ],
      "5-р хороо": [
        { id: "bg5-1", name: "Олимпик СӨХ", address: "Олимпийн гудамж, 5-р хороо", buildings: 4, units: 200, verified: true },
      ],
      "8-р хороо": [
        { id: "bg8-1", name: "Модны СӨХ", address: "8-р хороо, Баянгол", buildings: 3, units: 140, verified: true },
        { id: "bg8-2", name: "Зуун хуруу СӨХ", address: "8-р хороо, 10-р байр", buildings: 2, units: 84, verified: false },
      ],
      "16-р хороо": [
        { id: "bg16-1", name: "Баянгол towers СӨХ", address: "16-р хороо, шинэ суурьшил", buildings: 6, units: 320, verified: true },
      ],
    },
    "Чингэлтэй": {
      "1-р хороо": [
        { id: "ch1-1", name: "Гандан СӨХ", address: "Чингэлтэй, 1-р хороо", buildings: 3, units: 130, verified: true },
      ],
      "4-р хороо": [
        { id: "ch4-1", name: "Ард СӨХ", address: "4-р хороо, Чингэлтэй", buildings: 4, units: 180, verified: true },
        { id: "ch4-2", name: "Алтай СӨХ", address: "4-р хороо, 6-р байр", buildings: 2, units: 96, verified: true },
      ],
      "9-р хороо": [
        { id: "ch9-1", name: "Дамбадаржаа СӨХ", address: "Дамбадаржаа, 9-р хороо", buildings: 3, units: 150, verified: true },
      ],
    },
    "Сонгинохайрхан": {
      "3-р хороо": [
        { id: "sh3-1", name: "Баруун сэлбэ СӨХ", address: "3-р хороо, Сонгинохайрхан", buildings: 5, units: 240, verified: true },
        { id: "sh3-2", name: "Нарны гэрэл СӨХ", address: "3-р хороо, 12-р байр", buildings: 2, units: 80, verified: false },
      ],
      "7-р хороо": [
        { id: "sh7-1", name: "Толгойт СӨХ", address: "Толгойт, 7-р хороо", buildings: 4, units: 200, verified: true },
      ],
      "20-р хороо": [
        { id: "sh20-1", name: "Их засаг СӨХ", address: "20-р хороо, Сонгинохайрхан", buildings: 3, units: 144, verified: true },
        { id: "sh20-2", name: "Хөгжил СӨХ", address: "20-р хороо, 8-р байр", buildings: 2, units: 72, verified: true },
      ],
    },
  },
  "Дархан": {
    "Дархан": {
      "1-р хороо": [
        { id: "dk1-1", name: "Дархан төв СӨХ", address: "Дархан, 1-р хороо", buildings: 4, units: 160, verified: true },
        { id: "dk1-2", name: "Хөтөл СӨХ", address: "1-р хороо, Дархан", buildings: 2, units: 80, verified: false },
      ],
      "3-р хороо": [
        { id: "dk3-1", name: "Шарын гол СӨХ", address: "3-р хороо, Дархан", buildings: 3, units: 140, verified: true },
      ],
    },
    "Шарын гол": {
      "1-р хороо": [
        { id: "sg1-1", name: "Шарын гол хотхон СӨХ", address: "Шарын гол, 1-р хороо", buildings: 2, units: 96, verified: true },
      ],
    },
  },
  "Эрдэнэт": {
    "Баян-Өндөр": {
      "2-р хороо": [
        { id: "er2-1", name: "Эрдэнэт СӨХ", address: "Баян-Өндөр, 2-р хороо", buildings: 5, units: 240, verified: true },
        { id: "er2-2", name: "Уулын баяр СӨХ", address: "2-р хороо, Эрдэнэт", buildings: 3, units: 130, verified: true },
      ],
      "5-р хороо": [
        { id: "er5-1", name: "Зэст СӨХ", address: "5-р хороо, Баян-Өндөр", buildings: 3, units: 144, verified: true },
      ],
    },
  },
};

function RegisterScreen({ onBack, onSuccess }) {
  const [step, setStep] = useState(1); // 1=sokh, 2=info, 3=unit, 4=verify, 5=done
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");
  const [block, setBlock] = useState("A");
  const [unit, setUnit] = useState("");
  const [floor, setFloor] = useState("");
  const [type, setType] = useState("owner");
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // SOKh selection state
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedKhoroo, setSelectedKhoroo] = useState("");
  const [selectedSokh, setSelectedSokh] = useState(null);
  const [sokhSearch, setSokhSearch] = useState("");

  const cities = Object.keys(LOCATION_DATA);
  const districts = selectedCity ? Object.keys(LOCATION_DATA[selectedCity]) : [];
  const khoroos = selectedCity && selectedDistrict ? Object.keys(LOCATION_DATA[selectedCity][selectedDistrict]) : [];
  const sokhList = selectedCity && selectedDistrict && selectedKhoroo
    ? (LOCATION_DATA[selectedCity][selectedDistrict][selectedKhoroo] || [])
    : [];
  const filteredSokh = sokhSearch
    ? sokhList.filter(s => s.name.toLowerCase().includes(sokhSearch.toLowerCase()))
    : sokhList;

  const validateStep1 = () => {
    if (!selectedSokh) return "СӨХ-өө сонгоно уу";
    return null;
  };

  const validateStep2 = () => {
    if (!name.trim()) return "Нэрээ оруулна уу";
    if (!phone.trim() || phone.length < 8) return "Утасны дугаар 8 оронтой байна";
    if (!password || password.length < 4) return "Нууц үг хамгийн багадаа 4 тэмдэгт";
    if (password !== passwordConfirm) return "Нууц үг тохирохгүй байна";
    return null;
  };

  const validateStep3 = () => {
    if (!unit.trim()) return "Тоотоо оруулна уу";
    if (!floor.trim()) return "Давхараа оруулна уу";
    return null;
  };

  const handleNext = () => {
    if (step === 1) {
      const err = validateStep1();
      if (err) { setError(err); return; }
      setError("");
      setStep(2);
    } else if (step === 2) {
      const err = validateStep2();
      if (err) { setError(err); return; }
      setError("");
      setStep(3);
    } else if (step === 3) {
      const err = validateStep3();
      if (err) { setError(err); return; }
      setError("");
      setStep(4);
    } else if (step === 4) {
      if (code.length < 4) { setError("Баталгаажуулах код оруулна уу"); return; }
      setLoading(true);
      setError("");
      setTimeout(() => {
        setLoading(false);
        setStep(5);
      }, 1500);
    }
  };

  const handleFinish = () => {
    onSuccess({ name, phone, block, unit: parseInt(unit), floor: parseInt(floor), type, sokh: selectedSokh, city: selectedCity, district: selectedDistrict, khoroo: selectedKhoroo });
  };

  // Step indicator (4 steps)
  const StepIndicator = () => (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 6, marginBottom: 24 }}>
      {[1, 2, 3, 4].map(s => (
        <div key={s} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <div style={{
            width: 30, height: 30, borderRadius: 15,
            background: step >= s ? "#2563EB" : "#E2E8F0",
            color: step >= s ? "#fff" : "#94A3B8",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 12, fontWeight: 700, transition: "all 0.3s",
          }}>{step > s ? "✓" : s}</div>
          {s < 4 && <div style={{
            width: 20, height: 2, borderRadius: 1,
            background: step > s ? "#2563EB" : "#E2E8F0", transition: "all 0.3s",
          }} />}
        </div>
      ))}
    </div>
  );

  // Success screen (step 5)
  if (step === 5) return (
    <div style={{
      minHeight: "100vh", background: "#F0F2F5",
      fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
      padding: 24,
    }}>
      <div style={{
        width: 80, height: 80, borderRadius: 40, background: "#DCFCE7",
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 40, marginBottom: 20,
      }}>✅</div>
      <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 8, color: "#1A1A2E" }}>Бүртгэл амжилттай!</div>
      <div style={{ fontSize: 14, color: "#64748B", textAlign: "center", marginBottom: 8 }}>
        Сайн байна уу, {name}!
      </div>
      <div style={{
        background: "#FFF7ED", borderRadius: 12, padding: "12px 16px", marginBottom: 16,
        border: "1px solid #FED7AA", width: "100%", maxWidth: 340, textAlign: "center",
      }}>
        <div style={{ fontSize: 13, color: "#9A3412", fontWeight: 600 }}>⏳ Идэвхжүүлэх хүлээгдэж байна</div>
        <div style={{ fontSize: 11, color: "#C2410C", marginTop: 4 }}>СӨХ-ийн админ таны бүртгэлийг зөвшөөрсний дараа бүрэн ашиглах боломжтой</div>
      </div>
      <div style={{
        background: "#fff", borderRadius: 16, padding: 20, width: "100%", maxWidth: 340,
        marginBottom: 24, boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      }}>
        {selectedSokh && (
          <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
            <span style={{ fontSize: 13, color: "#94A3B8" }}>СӨХ</span>
            <span style={{ fontSize: 13, fontWeight: 700 }}>{selectedSokh.name}</span>
          </div>
        )}
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Байршил</span>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedCity}, {selectedDistrict}, {selectedKhoroo}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Блок</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{block}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Тоот</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{unit}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0", borderBottom: "1px solid #F1F5F9" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Давхар</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{floor}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", padding: "8px 0" }}>
          <span style={{ fontSize: 13, color: "#94A3B8" }}>Төрөл</span>
          <span style={{ fontSize: 13, fontWeight: 700 }}>{type === "owner" ? "Өмчлөгч" : "Түрээслэгч"}</span>
        </div>
      </div>
      <button onClick={handleFinish} style={{
        width: "100%", maxWidth: 340, padding: "16px 24px", borderRadius: 14, border: "none",
        background: "linear-gradient(135deg, #2563EB, #1D4ED8)",
        color: "#fff", fontSize: 16, fontWeight: 700, cursor: "pointer",
        boxShadow: "0 4px 16px rgba(37,99,235,0.3)",
      }}>
        Апп руу орох →
      </button>
    </div>
  );

  const selectStyle = (hasValue) => ({
    width: "100%", padding: "14px 16px", borderRadius: 12,
    border: hasValue ? "2px solid #2563EB" : "1.5px solid #E2E8F0",
    fontSize: 14, fontWeight: hasValue ? 600 : 400, outline: "none", boxSizing: "border-box",
    background: hasValue ? "#EFF6FF" : "#F8FAFC", color: hasValue ? "#1E40AF" : "#64748B",
    cursor: "pointer", transition: "all 0.2s", appearance: "none",
    backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' fill='%2394A3B8' viewBox='0 0 16 16'%3E%3Cpath d='M8 11L3 6h10z'/%3E%3C/svg%3E\")",
    backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center",
  });

  return (
    <div style={{
      minHeight: "100vh", background: "#F0F2F5",
      fontFamily: "'SF Pro Display', -apple-system, 'Segoe UI', sans-serif",
    }}>
      <div style={{
        background: "linear-gradient(135deg, #2563EB 0%, #1D4ED8 100%)",
        padding: "20px 20px 28px", color: "#fff",
      }}>
        <button onClick={() => step === 1 ? onBack() : setStep(step - 1)} style={{
          background: "none", border: "none", color: "#fff", fontSize: 18,
          cursor: "pointer", padding: "8px 0", display: "flex", alignItems: "center", gap: 6,
        }}>← {step === 1 ? "Буцах" : "Өмнөх"}</button>
        <div style={{ fontSize: 24, fontWeight: 800, marginTop: 12 }}>Бүртгүүлэх</div>
        <div style={{ fontSize: 13, opacity: 0.7, marginTop: 4 }}>
          {step === 1 && "Харьяалагдах СӨХ-өө сонгоно уу"}
          {step === 2 && "Хувийн мэдээллээ оруулна уу"}
          {step === 3 && "Байрны мэдээллээ оруулна уу"}
          {step === 4 && "Утсан дээрээ ирсэн кодыг оруулна уу"}
        </div>
      </div>

      <div style={{ padding: "20px 16px" }}>
        <StepIndicator />

        {/* Step 1: SOKh Selection (cascading) */}
        {step === 1 && (
          <>
            {/* City */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                🏙️ Хот / Аймаг
              </label>
              <select
                value={selectedCity}
                onChange={e => { setSelectedCity(e.target.value); setSelectedDistrict(""); setSelectedKhoroo(""); setSelectedSokh(null); setError(""); }}
                style={selectStyle(!!selectedCity)}
              >
                <option value="">Хот/Аймаг сонгоно уу</option>
                {cities.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* District */}
            {selectedCity && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                animation: "fadeSlideIn 0.3s ease",
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                  🏘️ Дүүрэг / Сум
                </label>
                <select
                  value={selectedDistrict}
                  onChange={e => { setSelectedDistrict(e.target.value); setSelectedKhoroo(""); setSelectedSokh(null); setError(""); }}
                  style={selectStyle(!!selectedDistrict)}
                >
                  <option value="">Дүүрэг сонгоно уу</option>
                  {districts.map(d => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
            )}

            {/* Khoroo */}
            {selectedDistrict && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                animation: "fadeSlideIn 0.3s ease",
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                  📍 Хороо
                </label>
                <select
                  value={selectedKhoroo}
                  onChange={e => { setSelectedKhoroo(e.target.value); setSelectedSokh(null); setSokhSearch(""); setError(""); }}
                  style={selectStyle(!!selectedKhoroo)}
                >
                  <option value="">Хороо сонгоно уу</option>
                  {khoroos.map(k => <option key={k} value={k}>{k}</option>)}
                </select>
              </div>
            )}

            {/* Breadcrumb */}
            {selectedCity && (
              <div style={{
                fontSize: 12, color: "#64748B", marginBottom: 12, padding: "0 4px",
                display: "flex", alignItems: "center", gap: 4, flexWrap: "wrap",
              }}>
                <span style={{ fontWeight: 700, color: "#2563EB" }}>{selectedCity}</span>
                {selectedDistrict && <><span style={{ color: "#CBD5E1" }}>›</span><span style={{ fontWeight: 600 }}>{selectedDistrict}</span></>}
                {selectedKhoroo && <><span style={{ color: "#CBD5E1" }}>›</span><span style={{ fontWeight: 600 }}>{selectedKhoroo}</span></>}
              </div>
            )}

            {/* SOKh List */}
            {selectedKhoroo && (
              <div style={{
                background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
                animation: "fadeSlideIn 0.3s ease",
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 10 }}>
                  🏢 СӨХ сонгох ({sokhList.length})
                </label>

                {sokhList.length > 3 && (
                  <input
                    value={sokhSearch}
                    onChange={e => setSokhSearch(e.target.value)}
                    placeholder="СӨХ хайх..."
                    style={{ ...S.input, marginBottom: 12, fontSize: 13 }}
                  />
                )}

                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {filteredSokh.map(s => (
                    <button
                      key={s.id}
                      onClick={() => { setSelectedSokh(s); setError(""); }}
                      style={{
                        padding: "14px 16px", borderRadius: 14, textAlign: "left",
                        border: selectedSokh?.id === s.id ? "2px solid #2563EB" : "2px solid #E2E8F0",
                        background: selectedSokh?.id === s.id ? "#EFF6FF" : "#F8FAFC",
                        cursor: "pointer", transition: "all 0.2s",
                      }}
                    >
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                        <div style={{ fontSize: 14, fontWeight: 700, color: selectedSokh?.id === s.id ? "#1E40AF" : "#1A1A2E" }}>
                          {s.name}
                        </div>
                        <div style={{ display: "flex", alignItems: "center", gap: 4 }}>
                          {s.verified && (
                            <span style={{
                              fontSize: 10, fontWeight: 700, color: "#16A34A", background: "#DCFCE7",
                              padding: "2px 8px", borderRadius: 10,
                            }}>✓ Баталгаат</span>
                          )}
                          {selectedSokh?.id === s.id && (
                            <span style={{
                              width: 22, height: 22, borderRadius: 11, background: "#2563EB",
                              display: "flex", alignItems: "center", justifyContent: "center",
                              color: "#fff", fontSize: 12, fontWeight: 700,
                            }}>✓</span>
                          )}
                        </div>
                      </div>
                      <div style={{ fontSize: 12, color: "#64748B", marginTop: 4 }}>{s.address}</div>
                      <div style={{ display: "flex", gap: 12, marginTop: 6 }}>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>🏗️ {s.buildings} байр</span>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>🏠 {s.units} айл</span>
                      </div>
                    </button>
                  ))}
                  {filteredSokh.length === 0 && (
                    <div style={{ textAlign: "center", padding: 20, color: "#94A3B8", fontSize: 13 }}>
                      СӨХ олдсонгүй
                    </div>
                  )}
                </div>
              </div>
            )}
          </>
        )}

        {/* Step 2: Personal Info */}
        {step === 2 && (
          <>
            {selectedSokh && (
              <div style={{
                background: "#EFF6FF", borderRadius: 12, padding: "10px 14px", marginBottom: 12,
                border: "1px solid #BFDBFE", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>🏢</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>{selectedSokh.name}</div>
                  <div style={{ fontSize: 11, color: "#3B82F6" }}>{selectedCity} › {selectedDistrict} › {selectedKhoroo}</div>
                </div>
              </div>
            )}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                👤 Овог, нэр
              </label>
              <input
                value={name} onChange={e => { setName(e.target.value); setError(""); }}
                placeholder="Бат-Эрдэнэ"
                style={{ ...S.input, fontSize: 16, fontWeight: 600 }}
              />
            </div>

            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                📱 Утасны дугаар
              </label>
              <input
                type="tel"
                value={phone} onChange={e => { setPhone(e.target.value.replace(/\D/g, "").slice(0, 8)); setError(""); }}
                placeholder="99112233"
                maxLength={8}
                style={{ ...S.input, fontSize: 18, fontWeight: 700, letterSpacing: 2 }}
              />
            </div>

            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                🔒 Нууц үг
              </label>
              <div style={{ position: "relative", marginBottom: 10 }}>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password} onChange={e => { setPassword(e.target.value); setError(""); }}
                  placeholder="Нууц үг (4+ тэмдэгт)"
                  style={{ ...S.input, paddingRight: 48 }}
                />
                <button onClick={() => setShowPassword(!showPassword)} style={{
                  position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                  background: "none", border: "none", cursor: "pointer", fontSize: 16,
                }}>{showPassword ? "🙈" : "👁️"}</button>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={passwordConfirm} onChange={e => { setPasswordConfirm(e.target.value); setError(""); }}
                placeholder="Нууц үг давтах"
                style={S.input}
              />
            </div>
          </>
        )}

        {/* Step 3: Unit Info */}
        {step === 3 && (
          <>
            {selectedSokh && (
              <div style={{
                background: "#EFF6FF", borderRadius: 12, padding: "10px 14px", marginBottom: 12,
                border: "1px solid #BFDBFE", display: "flex", alignItems: "center", gap: 10,
              }}>
                <span style={{ fontSize: 20 }}>🏢</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#1E40AF" }}>{selectedSokh.name}</div>
                  <div style={{ fontSize: 11, color: "#3B82F6" }}>{selectedCity} › {selectedDistrict} › {selectedKhoroo}</div>
                </div>
              </div>
            )}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 10 }}>
                🏗️ Блок
              </label>
              <div style={{ display: "flex", gap: 8 }}>
                {["A", "B", "C", "D"].map(b => (
                  <button key={b} onClick={() => setBlock(b)} style={{
                    flex: 1, padding: "14px 0", borderRadius: 12,
                    border: block === b ? "2px solid #2563EB" : "2px solid #E2E8F0",
                    background: block === b ? "#EFF6FF" : "#F8FAFC",
                    color: block === b ? "#2563EB" : "#64748B",
                    fontSize: 16, fontWeight: 700, cursor: "pointer", transition: "all 0.2s",
                  }}>{b}</button>
                ))}
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <div style={{
                background: "#fff", borderRadius: 16, padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                  🚪 Тоот
                </label>
                <input
                  type="number"
                  value={unit} onChange={e => { setUnit(e.target.value); setError(""); }}
                  placeholder="45"
                  style={{ ...S.input, fontSize: 20, fontWeight: 700, textAlign: "center" }}
                />
              </div>
              <div style={{
                background: "#fff", borderRadius: 16, padding: 20,
                boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
              }}>
                <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 8 }}>
                  🏢 Давхар
                </label>
                <input
                  type="number"
                  value={floor} onChange={e => { setFloor(e.target.value); setError(""); }}
                  placeholder="4"
                  style={{ ...S.input, fontSize: 20, fontWeight: 700, textAlign: "center" }}
                />
              </div>
            </div>

            <div style={{
              background: "#fff", borderRadius: 16, padding: 20, marginTop: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <label style={{ fontSize: 12, fontWeight: 700, color: "#64748B", display: "block", marginBottom: 10 }}>
                🏠 Оршин суугчийн төрөл
              </label>
              <div style={{ display: "flex", gap: 10 }}>
                {[
                  { id: "owner", label: "Өмчлөгч", icon: "🔑", desc: "Өөрийн орон сууц" },
                  { id: "tenant", label: "Түрээслэгч", icon: "📋", desc: "Түрээсээр амьдарч буй" },
                ].map(t => (
                  <button key={t.id} onClick={() => setType(t.id)} style={{
                    flex: 1, padding: "16px 12px", borderRadius: 14,
                    border: type === t.id ? "2px solid #2563EB" : "2px solid #E2E8F0",
                    background: type === t.id ? "#EFF6FF" : "#F8FAFC",
                    cursor: "pointer", transition: "all 0.2s", textAlign: "center",
                  }}>
                    <div style={{ fontSize: 24, marginBottom: 6 }}>{t.icon}</div>
                    <div style={{ fontSize: 13, fontWeight: 700, color: type === t.id ? "#2563EB" : "#1A1A2E" }}>{t.label}</div>
                    <div style={{ fontSize: 10, color: "#94A3B8", marginTop: 2 }}>{t.desc}</div>
                  </button>
                ))}
              </div>
            </div>
          </>
        )}

        {/* Step 4: Verification */}
        {step === 4 && (
          <>
            <div style={{
              background: "#fff", borderRadius: 16, padding: 24, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
              textAlign: "center",
            }}>
              <div style={{
                width: 64, height: 64, borderRadius: 20, background: "#EFF6FF",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 30, margin: "0 auto 16px",
              }}>📲</div>
              <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>Баталгаажуулах</div>
              <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>
                <span style={{ fontWeight: 700, color: "#1A1A2E" }}>{phone}</span> дугаар руу код илгээлээ
              </div>

              <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 20 }}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} style={{
                    width: 52, height: 60, borderRadius: 14,
                    background: code[i] ? "#EFF6FF" : "#F8FAFC",
                    border: `2px solid ${code[i] ? "#2563EB" : "#E2E8F0"}`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontSize: 24, fontWeight: 800, color: "#2563EB",
                    transition: "all 0.2s",
                  }}>
                    {code[i] || ""}
                  </div>
                ))}
              </div>

              <input
                type="tel"
                value={code}
                onChange={e => { setCode(e.target.value.replace(/\D/g, "").slice(0, 4)); setError(""); }}
                placeholder="4 оронтой код"
                maxLength={4}
                autoFocus
                style={{
                  ...S.input, textAlign: "center", fontSize: 22, fontWeight: 700,
                  letterSpacing: 14, caretColor: "#2563EB", maxWidth: 240, margin: "0 auto",
                }}
              />

              <button style={{
                display: "block", margin: "16px auto 0", background: "none", border: "none",
                color: "#2563EB", fontSize: 13, fontWeight: 600, cursor: "pointer",
              }}>
                Код дахин илгээх
              </button>
            </div>

            {/* Summary */}
            <div style={{
              background: "#fff", borderRadius: 16, padding: 16, marginBottom: 12,
              boxShadow: "0 1px 3px rgba(0,0,0,0.06)", border: "1px solid rgba(0,0,0,0.04)",
            }}>
              <div style={{ fontSize: 12, fontWeight: 700, color: "#94A3B8", marginBottom: 10 }}>Бүртгэлийн мэдээлэл</div>
              {selectedSokh && (
                <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                  <span style={{ fontSize: 13, color: "#64748B" }}>СӨХ</span>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{selectedSokh.name}</span>
                </div>
              )}
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Байршил</span>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{selectedDistrict}, {selectedKhoroo}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Нэр</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{name}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Утас</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{phone}</span>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
                <span style={{ fontSize: 13, color: "#64748B" }}>Байр</span>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{block} блок, {unit} тоот, {floor}-р давхар</span>
              </div>
            </div>
          </>
        )}

        {/* Error */}
        {error && (
          <div style={{
            background: "#FEF2F2", borderRadius: 12, padding: "12px 16px",
            marginBottom: 12, fontSize: 13, color: "#991B1B", fontWeight: 500,
            border: "1px solid #FECACA", marginTop: 8,
          }}>
            ⚠️ {error}
          </div>
        )}

        {/* Next Button */}
        <button onClick={handleNext} disabled={loading} style={{
          width: "100%", padding: "16px 24px", borderRadius: 14, border: "none",
          background: loading ? "#94A3B8" : "linear-gradient(135deg, #2563EB, #1D4ED8)",
          color: "#fff", fontSize: 16, fontWeight: 700, cursor: loading ? "not-allowed" : "pointer",
          boxShadow: loading ? "none" : "0 4px 16px rgba(37,99,235,0.3)",
          display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
          transition: "all 0.2s", marginTop: 8,
        }}>
          {loading ? (
            <><span style={{ display: "inline-block", animation: "spin 1s linear infinite" }}>⏳</span> Баталгаажуулж байна...</>
          ) : step === 4 ? "Баталгаажуулах" : "Үргэлжлүүлэх →"}
        </button>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @keyframes fadeSlideIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>
    </div>
  );
}

/* ─── MAIN APP ─── */
export default function SOKHApp() {
  const [authScreen, setAuthScreen] = useState("welcome"); // welcome | login | register | app
  const [currentUser, setCurrentUser] = useState(null);
  const [screen, setScreen] = useState("home");
  const [mode, setMode] = useState("resident"); // resident | admin
  const [payments, setPayments] = useState(INIT_PAYMENTS);
  const [requests, setRequests] = useState(INIT_REQUESTS);
  const [payingId, setPayingId] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [org, setOrg] = useState({ name: "СӨХ", logo: null, address: "", phone: "", email: "", blocks: "A, B", color: "#2563EB" });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminError, setAdminError] = useState("");

  useEffect(() => { setMounted(true); }, []);

  // Auth handlers
  const handleLoginSuccess = (user) => {
    setCurrentUser(user);
    setAuthScreen("app");
  };

  const handleRegisterSuccess = (user) => {
    setCurrentUser(user);
    setAuthScreen("app");
  };

  // Render auth screens
  if (authScreen === "welcome") {
    return <WelcomeScreen onLogin={() => setAuthScreen("login")} onRegister={() => setAuthScreen("register")} />;
  }
  if (authScreen === "login") {
    return <LoginScreen onBack={() => setAuthScreen("welcome")} onSuccess={handleLoginSuccess} />;
  }
  if (authScreen === "register") {
    return <RegisterScreen onBack={() => setAuthScreen("welcome")} onSuccess={handleRegisterSuccess} />;
  }

  const SUPER_ADMIN_PIN = "1234"; // Default PIN

  const handleOrgSave = (data) => {
    setOrg(data);
    setScreen("home");
    setMode("admin");
  };

  const handleAdminLogin = () => {
    if (adminPin === SUPER_ADMIN_PIN) {
      setIsAdmin(true);
      setShowAdminLogin(false);
      setMode("admin");
      setAdminPin("");
      setAdminError("");
    } else {
      setAdminError("Нууц код буруу байна");
    }
  };

  const handleAdminLogout = () => {
    setIsAdmin(false);
    setMode("resident");
    setScreen("home");
  };

  const goTo = (s) => {
    if (s === "admin") {
      if (isAdmin) { setMode("admin"); return; }
      setShowAdminLogin(true);
      return;
    }
    if (s === "home" && mode === "admin") { setMode("resident"); }
    setScreen(s);
  };

  const handlePay = (id) => { setPayingId(id); setScreen("pay"); };
  const confirmPay = () => {
    setPayments(prev => prev.map(p => p.id === payingId ? { ...p, paid: true } : p));
    setPayingId(null);
    setScreen("payments");
  };

  const addRequest = ({ cat, desc }) => {
    setRequests(prev => [
      { id: Date.now(), unit: 45, cat, title: cat + " асуудал", desc, status: "open", date: "2026.03.14" },
      ...prev,
    ]);
  };

  const payingPayment = payments.find(p => p.id === payingId);

  // Bottom nav for resident app
  const BottomNav = () => (
    <div style={{
      position: "fixed", bottom: 0, left: "50%", transform: "translateX(-50%)",
      width: "100%", maxWidth: 440, background: "#fff",
      borderTop: "1px solid #F1F5F9", display: "flex", zIndex: 100,
      boxShadow: "0 -2px 10px rgba(0,0,0,0.04)",
    }}>
      {[
        { id: "home", icon: "🏠", label: "Нүүр" },
        { id: "utilities", icon: "⚡", label: "Хэрэглээ" },
        { id: "requests", icon: "📝", label: "Хүсэлт" },
        { id: "myUnit", icon: "👤", label: "Миний" },
        { id: "admin", icon: "🔐", label: "Админ" },
      ].map(t => (
        <button key={t.id} onClick={() => goTo(t.id)} style={S.tab(screen === t.id || (t.id === "admin" && mode === "admin"))}>
          <div style={{ fontSize: 18 }}>{t.icon}</div>
          {t.label}
        </button>
      ))}
    </div>
  );

  // Admin Login Modal
  const AdminLoginModal = () => showAdminLogin && (
    <div style={{
      position: "fixed", top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.5)", zIndex: 300, display: "flex", alignItems: "center", justifyContent: "center",
      padding: 20,
    }} onClick={() => { setShowAdminLogin(false); setAdminPin(""); setAdminError(""); }}>
      <div style={{
        background: "#fff", borderRadius: 24, padding: 28, maxWidth: 340, width: "100%",
        boxShadow: "0 20px 60px rgba(0,0,0,0.3)", textAlign: "center",
      }} onClick={e => e.stopPropagation()}>
        <div style={{
          width: 64, height: 64, borderRadius: 20, background: `${org.color}12`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontSize: 30, margin: "0 auto 16px",
        }}>🔐</div>
        <div style={{ fontSize: 20, fontWeight: 800, marginBottom: 4 }}>Super Admin</div>
        <div style={{ fontSize: 13, color: "#64748B", marginBottom: 20 }}>Нууц код оруулна уу</div>

        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginBottom: 16 }}>
          {[0, 1, 2, 3].map(i => (
            <div key={i} style={{
              width: 48, height: 56, borderRadius: 14,
              background: adminPin[i] ? `${org.color}12` : "#F8FAFC",
              border: `2px solid ${adminPin[i] ? org.color : "#E2E8F0"}`,
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 24, fontWeight: 800, color: org.color,
              transition: "all 0.2s",
            }}>
              {adminPin[i] ? "●" : ""}
            </div>
          ))}
        </div>

        <input
          type="password"
          value={adminPin}
          onChange={e => { setAdminPin(e.target.value.slice(0, 4)); setAdminError(""); }}
          onKeyDown={e => { if (e.key === "Enter") handleAdminLogin(); }}
          placeholder="4 оронтой нууц код"
          maxLength={4}
          autoFocus
          style={{
            ...S.input, textAlign: "center", fontSize: 20, fontWeight: 700,
            letterSpacing: 12, marginBottom: 12, caretColor: org.color,
          }}
        />

        {adminError && (
          <div style={{ background: "#FEF2F2", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 12, color: "#991B1B" }}>
            ⚠️ {adminError}
          </div>
        )}

        <button onClick={handleAdminLogin} disabled={adminPin.length < 4} style={{
          ...S.btn(adminPin.length >= 4 ? org.color : "#94A3B8"), marginBottom: 10,
        }}>
          Нэвтрэх
        </button>
        <button onClick={() => { setShowAdminLogin(false); setAdminPin(""); setAdminError(""); }} style={{
          background: "none", border: "none", color: "#94A3B8", fontSize: 13, cursor: "pointer",
        }}>
          Болих
        </button>

        <div style={{ marginTop: 16, fontSize: 10, color: "#CBD5E1" }}>
          Анхны нууц код: 1234
        </div>
      </div>
    </div>
  );

  if (mode === "admin") {
    return (
      <div style={{
        ...S.adminApp,
        opacity: mounted ? 1 : 0, transition: "opacity 0.4s",
      }}>
        <AdminDashboard payments={payments} requests={requests} goTo={goTo} org={org} onOrgSave={handleOrgSave} onLogout={handleAdminLogout} />
        <BottomNav />
        <AdminLoginModal />
        <div style={{ height: 60 }} />
      </div>
    );
  }

  return (
    <div style={{
      ...S.app,
      opacity: mounted ? 1 : 0, transition: "opacity 0.4s",
    }}>
      {screen === "home" && <ResidentHome payments={payments} requests={requests} goTo={goTo} org={org} />}
      {screen === "utilities" && <UtilitiesScreen goTo={goTo} org={org} />}
      {screen === "payments" && <PaymentsScreen payments={payments} onPay={handlePay} goTo={goTo} />}
      {screen === "pay" && payingPayment && <PayScreen payment={payingPayment} onConfirm={confirmPay} goTo={goTo} />}
      {screen === "requests" && <RequestsScreen requests={requests} goTo={goTo} />}
      {screen === "newRequest" && <NewRequestScreen onSubmit={addRequest} goTo={goTo} />}
      {screen === "myUnit" && <MyUnitScreen goTo={goTo} />}
      <BottomNav />
      <AdminLoginModal />
      <div style={{ height: 60 }} />
    </div>
  );
}
