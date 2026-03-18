import { useState } from "react";
import {
  Settings, MapPin, CreditCard, Globe, Bell, Plus, Trash2, Check,
} from "lucide-react";
import { FBIcon, IGIcon, TKIcon, YTIcon } from "../../components/icons/SocialIcons";
import useApp from "../../hooks/useApp";

export default function SettingsTab() {
  const { dark, cd, bd, txS, aL, inp, lang, t, BIZ, setBIZ, addToast, saveSettingsAPI } =
    useApp();
  const [saving, setSaving] = useState(false);

  return (
    <div className="space-y-4 max-w-2xl">
      {/* Business Info */}
      <div className={`${cd} rounded-xl border ${bd} p-5`}>
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Settings size={18} className="text-amber-500" />
          {lang === "mn" ? "Бизнесийн мэдээлэл" : "Business Info"}
        </h3>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {lang === "mn" ? "Бизнесийн нэр" : "Business Name"}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.name}
              onChange={(e) => setBIZ({ ...BIZ, name: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {t.phone} 1
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.phone}
              onChange={(e) => setBIZ({ ...BIZ, phone: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {t.phone} 2
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.phone2}
              onChange={(e) => setBIZ({ ...BIZ, phone2: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {t.address}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.address}
              onChange={(e) => setBIZ({ ...BIZ, address: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {lang === "mn" ? "Ажлын цаг" : "Work Hours"}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.workHours}
              onChange={(e) => setBIZ({ ...BIZ, workHours: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-3">
          <label className={`block text-xs mb-1 ${txS}`}>
            Google Maps Embed URL
          </label>
          <input
            className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
            placeholder="https://www.google.com/maps/embed?pb=..."
            value={BIZ.mapEmbed || ""}
            onChange={(e) => setBIZ({ ...BIZ, mapEmbed: e.target.value })}
          />
          <p className={`text-xs mt-1 ${txS}`}>
            {lang === "mn"
              ? 'Google Maps → "Share" → "Embed a map" → iframe src хуулах'
              : 'Google Maps → "Share" → "Embed a map" → copy iframe src'}
          </p>
        </div>
        <div className="mt-3">
          <label className={`block text-xs mb-1 ${txS}`}>
            Google Maps {lang === "mn" ? "линк" : "Link"}
          </label>
          <input
            className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
            placeholder="https://www.google.com/maps/..."
            value={BIZ.mapUrl || ""}
            onChange={(e) => setBIZ({ ...BIZ, mapUrl: e.target.value })}
          />
          <p className={`text-xs mt-1 ${txS}`}>
            {lang === "mn"
              ? 'Google Maps → "Share" → "Copy link" дарж хуулах'
              : 'Google Maps → "Share" → "Copy link"'}
          </p>
        </div>
      </div>

      {/* Branches */}
      <div className={`${cd} rounded-xl border ${bd} p-5`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold flex items-center gap-2">
            <MapPin size={18} className="text-amber-500" />
            {lang === "mn" ? "Салбарууд" : "Branches"}
          </h3>
          <button
            onClick={() =>
              setBIZ({
                ...BIZ,
                branches: [
                  ...BIZ.branches,
                  { name: "", phone: "", address: "" },
                ],
              })
            }
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium"
          >
            <Plus size={14} />
            {lang === "mn" ? "Салбар нэмэх" : "Add Branch"}
          </button>
        </div>
        <div className="space-y-3">
          {BIZ.branches.map((br, i) => (
            <div
              key={i}
              className={`p-4 rounded-xl border ${bd} ${
                dark ? "bg-gray-700/30" : "bg-gray-50"
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-bold text-amber-500">
                  {lang === "mn" ? "Салбар" : "Branch"} #{i + 1}
                </span>
                {BIZ.branches.length > 1 && (
                  <button
                    onClick={() =>
                      setBIZ({
                        ...BIZ,
                        branches: BIZ.branches.filter((_, j) => j !== i),
                      })
                    }
                    className="text-red-500 hover:text-red-700"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div className="grid md:grid-cols-3 gap-2">
                <div>
                  <label className={`block text-xs mb-1 ${txS}`}>
                    {t.name}
                  </label>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
                    placeholder={
                      lang === "mn" ? "Төв салбар" : "Main Branch"
                    }
                    value={br.name}
                    onChange={(e) => {
                      const b = [...BIZ.branches];
                      b[i] = { ...b[i], name: e.target.value };
                      setBIZ({ ...BIZ, branches: b });
                    }}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${txS}`}>
                    {t.phone}
                  </label>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
                    placeholder="9999-1234"
                    value={br.phone}
                    onChange={(e) => {
                      const b = [...BIZ.branches];
                      b[i] = { ...b[i], phone: e.target.value };
                      setBIZ({ ...BIZ, branches: b });
                    }}
                  />
                </div>
                <div>
                  <label className={`block text-xs mb-1 ${txS}`}>
                    {t.address}
                  </label>
                  <input
                    className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
                    placeholder={
                      lang === "mn" ? "Хаяг оруулах" : "Enter address"
                    }
                    value={br.address}
                    onChange={(e) => {
                      const b = [...BIZ.branches];
                      b[i] = { ...b[i], address: e.target.value };
                      setBIZ({ ...BIZ, branches: b });
                    }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Payment Info */}
      <div className={`${cd} rounded-xl border ${bd} p-5`}>
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <CreditCard size={18} className="text-amber-500" />
          {lang === "mn" ? "Төлбөрийн мэдээлэл" : "Payment Info"}
        </h3>
        <div className="grid md:grid-cols-3 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {lang === "mn" ? "Банкны нэр" : "Bank Name"}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.bankName}
              onChange={(e) => setBIZ({ ...BIZ, bankName: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {lang === "mn" ? "Дансны дугаар" : "Account No."}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.accountNo}
              onChange={(e) => setBIZ({ ...BIZ, accountNo: e.target.value })}
            />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>
              {lang === "mn" ? "Данс эзэмшигч" : "Account Holder"}
            </label>
            <input
              className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={BIZ.accountHolder}
              onChange={(e) =>
                setBIZ({ ...BIZ, accountHolder: e.target.value })
              }
            />
          </div>
        </div>
      </div>

      {/* Social Links */}
      <div className={`${cd} rounded-xl border ${bd} p-5`}>
        <h3 className="font-bold mb-4 flex items-center gap-2">
          <Globe size={18} className="text-amber-500" />
          {t.connectedAccounts}
        </h3>
        <div className="space-y-3">
          {[
            ["facebook", "Facebook", FBIcon, "text-blue-600"],
            ["instagram", "Instagram", IGIcon, "text-pink-600"],
            [
              "tiktok",
              "TikTok",
              TKIcon,
              dark ? "text-white" : "text-black",
            ],
            ["youtube", "YouTube", YTIcon, "text-red-600"],
          ].map(([key, label, Icon, clr]) => (
            <div key={key} className="flex items-center gap-3">
              <Icon size={20} className={clr} />
              <input
                className={`flex-1 px-3 py-2 rounded-lg border text-sm ${inp}`}
                placeholder={`${label} URL`}
                value={BIZ[key]}
                onChange={(e) => setBIZ({ ...BIZ, [key]: e.target.value })}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Notification Settings */}
      <div className={`${cd} rounded-xl border ${bd} p-5`}>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <Bell size={18} className="text-amber-500" />
          {t.notifSettings}
        </h3>
        <label className="flex items-center justify-between py-2">
          <span className="text-sm">{t.emailNotif}</span>
          <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
          </div>
        </label>
        <label className="flex items-center justify-between py-2">
          <span className="text-sm">{t.smsNotif}</span>
          <div className="w-10 h-6 bg-green-500 rounded-full relative cursor-pointer">
            <div className="w-4 h-4 bg-white rounded-full absolute right-1 top-1" />
          </div>
        </label>
      </div>

      {/* Facebook Integration */}
      <div className={`${cd} rounded-xl border ${bd} p-4`}>
        <h3 className="font-bold mb-3 flex items-center gap-2">
          <FBIcon size={18} className="text-blue-500" />
          Facebook Integration
        </h3>
        <div className="mb-4">
          <label className={`block text-xs mb-1 font-medium ${txS}`}>
            Facebook Pixel ID
          </label>
          <input
            className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
            placeholder="123456789012345"
            value={BIZ.fbPixelId || ""}
            onChange={(e) => setBIZ({ ...BIZ, fbPixelId: e.target.value })}
          />
          <p className={`text-xs mt-1 ${txS}`}>
            Facebook Ads Manager → Events Manager → Pixel ID
          </p>
        </div>
        <div className="mb-4">
          <label className={`block text-xs mb-1 font-medium ${txS}`}>
            Facebook Page ID
          </label>
          <input
            className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
            placeholder="PageName"
            value={BIZ.fbPageId || ""}
            onChange={(e) => setBIZ({ ...BIZ, fbPageId: e.target.value })}
          />
        </div>
        <div className={`p-3 rounded-lg ${aL} mb-4`}>
          <div className="flex items-center gap-2 mb-2">
            <div
              className={`w-3 h-3 rounded-full ${
                BIZ.fbPixelId ? "bg-green-500 animate-pulse" : "bg-red-500"
              }`}
            />
            <span className="text-sm font-medium">
              FB Pixel:{" "}
              {BIZ.fbPixelId
                ? lang === "mn"
                  ? "Идэвхтэй"
                  : "Active"
                : lang === "mn"
                ? "Тохируулаагүй"
                : "Not configured"}
            </span>
          </div>
          <p className={`text-xs ${txS}`}>
            {lang === "mn"
              ? "Pixel нь: AddToCart, Purchase event илгээнэ"
              : "Pixel tracks: AddToCart, Purchase events"}
          </p>
        </div>

        <details className={`rounded-lg border ${bd} overflow-hidden`}>
          <summary className="p-3 cursor-pointer font-medium text-sm flex items-center gap-2 hover:bg-gray-50 dark:hover:bg-gray-800">
            <Globe size={16} className="text-blue-500" />
            {lang === "mn"
              ? "📘 Facebook Page үүсгэх заавар"
              : "📘 Facebook Page Setup Guide"}
          </summary>
          <div className={`p-4 border-t ${bd} text-sm space-y-3`}>
            <div className={`p-3 rounded-lg ${aL}`}>
              <p className="font-bold text-amber-500 mb-1">
                {lang === "mn"
                  ? "Алхам 1: FB Page үүсгэх"
                  : "Step 1: Create FB Page"}
              </p>
              <p className={txS}>
                1.{" "}
                <a
                  href="https://www.facebook.com/pages/create"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  facebook.com/pages/create
                </a>{" "}
                {lang === "mn" ? "руу орох" : "visit"}
              </p>
              <p className={txS}>
                2.{" "}
                {lang === "mn"
                  ? '"Business or Brand" сонгох'
                  : 'Choose "Business or Brand"'}
              </p>
              <p className={txS}>
                3. {lang === "mn" ? "Нэр" : "Name"}:{" "}
                <strong>{BIZ.name}</strong>
              </p>
              <p className={txS}>
                4. {lang === "mn" ? "Ангилал" : "Category"}:{" "}
                <strong>{lang === "mn" ? "Сууц Өмчлөгчдийн Холбоо" : "Homeowners Association"}</strong>
              </p>
            </div>
            <div className={`p-3 rounded-lg ${aL}`}>
              <p className="font-bold text-amber-500 mb-1">
                {lang === "mn"
                  ? "Алхам 2: Page тохируулах"
                  : "Step 2: Configure Page"}
              </p>
              <p className={txS}>
                •{" "}
                {lang === "mn" ? "Profile зураг" : "Profile photo"}:{" "}
                {lang === "mn" ? "Чононы лого" : "Wolf logo"}
              </p>
              <p className={txS}>
                • {lang === "mn" ? "Cover зураг" : "Cover photo"}:{" "}
                {lang === "mn" ? "Дэлгүүрийн зураг" : "Shop photo"}
              </p>
              <p className={txS}>
                • {lang === "mn" ? "Утас" : "Phone"}: {BIZ.phone}
              </p>
              <p className={txS}>
                • {lang === "mn" ? "Хаяг" : "Address"}: {BIZ.address}
              </p>
              <p className={txS}>
                • {lang === "mn" ? "Ажлын цаг" : "Hours"}: {BIZ.workHours}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${aL}`}>
              <p className="font-bold text-amber-500 mb-1">
                {lang === "mn"
                  ? "Алхам 3: FB Pixel суулгах"
                  : "Step 3: Install FB Pixel"}
              </p>
              <p className={txS}>
                1.{" "}
                <a
                  href="https://business.facebook.com/events_manager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Events Manager
                </a>{" "}
                {lang === "mn" ? "руу орох" : "visit"}
              </p>
              <p className={txS}>
                2.{" "}
                {lang === "mn"
                  ? '"Connect Data Sources" → "Web"'
                  : '"Connect Data Sources" → "Web"'}
              </p>
              <p className={txS}>
                3.{" "}
                {lang === "mn"
                  ? "Pixel ID хуулж дээр оруулах"
                  : "Copy Pixel ID and paste above"}
              </p>
            </div>
            <div className={`p-3 rounded-lg ${aL}`}>
              <p className="font-bold text-amber-500 mb-1">
                {lang === "mn"
                  ? "Алхам 4: Зар сурталчилгаа"
                  : "Step 4: Run Ads"}
              </p>
              <p className={txS}>
                1.{" "}
                <a
                  href="https://www.facebook.com/ads/manager"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 underline"
                >
                  Ads Manager
                </a>{" "}
                {lang === "mn" ? "руу орох" : "visit"}
              </p>
              <p className={txS}>
                2.{" "}
                {lang === "mn"
                  ? '"Create" → "Traffic" / "Conversions"'
                  : '"Create" → "Traffic" / "Conversions"'}
              </p>
              <p className={txS}>
                3.{" "}
                {lang === "mn"
                  ? "Зорилтот бүлэг: 25-55 нас, УБ, орон сууцтай"
                  : "Target: 25-55 age, UB, apartment owners"}
              </p>
              <p className={txS}>
                4.{" "}
                {lang === "mn"
                  ? "Бюджет: 10,000₮/өдөр-с эхлэх"
                  : "Budget: start from 10,000₮/day"}
              </p>
            </div>
            <div
              className={`p-3 rounded-lg bg-amber-50 dark:bg-amber-900/20`}
            >
              <p className="font-bold text-amber-500 mb-1">
                💡{" "}
                {lang === "mn"
                  ? "Зар бичих template"
                  : "Ad copy template"}
              </p>
              <p className="text-xs whitespace-pre-wrap">
                {`🏢 ${BIZ.name}\n📍 ${BIZ.address}\n☎️ ${BIZ.phone}`}
              </p>
            </div>
          </div>
        </details>
      </div>

      {/* Save */}
      <button
        disabled={saving}
        onClick={async () => {
          setSaving(true);
          try {
            await saveSettingsAPI(BIZ);
            addToast(lang === "mn" ? "Тохиргоо хадгалагдлаа!" : "Settings saved!");
          } catch (err) {
            addToast(err.message || "Save failed");
          } finally {
            setSaving(false);
          }
        }}
        className="w-full py-3 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
      >
        <Check size={18} />
        {saving ? "..." : t.save}
      </button>
    </div>
  );
}
