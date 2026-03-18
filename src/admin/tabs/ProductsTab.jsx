import { useState } from "react";
import { AlertTriangle, Plus, Pencil, Trash2, X, Save, Upload } from "lucide-react";
import useApp from "../../hooks/useApp";
import { LOW_STOCK_THRESHOLD, models, partCats } from "../../data/products";
import { fmt } from "../../utils/helpers";
import * as api from "../../api/client";

const emptyProduct = {
  name: { mn: "", en: "" },
  price: 0,
  model: "1-р байр",
  cat: "Сантехник",
  rating: 0,
  stock: 0,
  cond: "new",
  img: "",
  emoji: "",
  desc: { mn: "", en: "" },
};

export default function ProductsTab() {
  const { dark, cd, bd, txS, inp, aL, lang, t, products, refreshProducts, addToast } = useApp();
  const [editing, setEditing] = useState(null); // null | "new" | product object
  const [form, setForm] = useState(emptyProduct);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);

  const startNew = () => {
    setForm({ ...emptyProduct, name: { mn: "", en: "" }, desc: { mn: "", en: "" } });
    setEditing("new");
  };

  const startEdit = (p) => {
    setForm({
      name: { mn: p.name.mn, en: p.name.en },
      price: p.price,
      model: p.model,
      cat: p.cat,
      rating: p.rating || 0,
      stock: p.stock,
      cond: p.cond,
      img: p.img,
      emoji: p.emoji || "",
      desc: { mn: p.desc?.mn || "", en: p.desc?.en || "" },
    });
    setEditing(p);
  };

  const handleSave = async () => {
    if (!form.name.mn || !form.name.en) {
      addToast("Name required"); return;
    }
    setSaving(true);
    try {
      if (editing === "new") {
        await api.createProduct(form);
        addToast(lang === "mn" ? "Бүтээгдэхүүн нэмэгдлээ" : "Product created");
      } else {
        await api.updateProduct(editing._id, form);
        addToast(lang === "mn" ? "Бүтээгдэхүүн шинэчлэгдлээ" : "Product updated");
      }
      await refreshProducts();
      setEditing(null);
    } catch (err) {
      addToast(err.message || "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (p) => {
    if (!confirm(lang === "mn" ? "Устгах уу?" : "Delete this product?")) return;
    try {
      await api.deleteProduct(p._id);
      await refreshProducts();
      addToast(lang === "mn" ? "Устгагдлаа" : "Deleted");
    } catch (err) {
      addToast(err.message || "Delete failed");
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const { url } = await api.uploadImage(file);
      setForm({ ...form, img: url });
    } catch (err) {
      addToast(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  // Edit/Create form
  if (editing) {
    return (
      <div className={`${cd} rounded-xl border ${bd} p-5 max-w-2xl`}>
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-lg text-amber-500">
            {editing === "new"
              ? (lang === "mn" ? "Шинэ бүтээгдэхүүн" : "New Product")
              : (lang === "mn" ? "Засах" : "Edit Product")}
          </h3>
          <button onClick={() => setEditing(null)}><X size={18} /></button>
        </div>
        <div className="grid md:grid-cols-2 gap-3">
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>{t.name} (MN)</label>
            <input className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.name.mn} onChange={(e) => setForm({ ...form, name: { ...form.name, mn: e.target.value } })} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>{t.name} (EN)</label>
            <input className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.name.en} onChange={(e) => setForm({ ...form, name: { ...form.name, en: e.target.value } })} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>{t.price}</label>
            <input type="number" className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.price} onChange={(e) => setForm({ ...form, price: Number(e.target.value) })} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Stock</label>
            <input type="number" className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.stock} onChange={(e) => setForm({ ...form, stock: Number(e.target.value) })} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Model</label>
            <select className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.model} onChange={(e) => setForm({ ...form, model: e.target.value })}>
              {models.map((m) => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Category</label>
            <select className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.cat} onChange={(e) => setForm({ ...form, cat: e.target.value })}>
              {partCats.map((c) => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>{t.status}</label>
            <select className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.cond} onChange={(e) => setForm({ ...form, cond: e.target.value })}>
              <option value="new">{t.new}</option>
              <option value="used">{t.used}</option>
            </select>
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Emoji</label>
            <input className={`w-full px-3 py-2 rounded-lg border text-sm ${inp}`}
              value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} />
          </div>
          <div className="md:col-span-2">
            <label className={`block text-xs mb-1 ${txS}`}>Image</label>
            <div className="flex items-center gap-2">
              <input className={`flex-1 px-3 py-2 rounded-lg border text-sm ${inp}`}
                placeholder="URL or upload"
                value={form.img} onChange={(e) => setForm({ ...form, img: e.target.value })} />
              <label className="px-3 py-2 rounded-lg bg-amber-500 text-white text-sm cursor-pointer flex items-center gap-1">
                <Upload size={14} />
                {uploading ? "..." : "Upload"}
                <input type="file" accept="image/*" className="hidden" onChange={handleImageUpload} />
              </label>
            </div>
            {form.img && <img src={form.img} alt="" className="mt-2 w-20 h-20 object-cover rounded-lg" />}
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Desc (MN)</label>
            <textarea className={`w-full px-3 py-2 rounded-lg border text-sm ${inp} resize-none`} rows={2}
              value={form.desc.mn} onChange={(e) => setForm({ ...form, desc: { ...form.desc, mn: e.target.value } })} />
          </div>
          <div>
            <label className={`block text-xs mb-1 ${txS}`}>Desc (EN)</label>
            <textarea className={`w-full px-3 py-2 rounded-lg border text-sm ${inp} resize-none`} rows={2}
              value={form.desc.en} onChange={(e) => setForm({ ...form, desc: { ...form.desc, en: e.target.value } })} />
          </div>
        </div>
        <div className="flex gap-3 mt-4">
          <button onClick={() => setEditing(null)} className={`flex-1 py-2.5 rounded-xl border font-medium ${bd}`}>
            {lang === "mn" ? "Болих" : "Cancel"}
          </button>
          <button disabled={saving} onClick={handleSave}
            className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50">
            <Save size={16} />
            {saving ? "..." : t.save}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-end mb-3">
        <button onClick={startNew}
          className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500 text-white text-xs font-medium">
          <Plus size={14} />
          {lang === "mn" ? "Бүтээгдэхүүн нэмэх" : "Add Product"}
        </button>
      </div>
      <div className={`${cd} rounded-xl border ${bd} overflow-x-auto`}>
        <table className="w-full text-sm">
          <thead className={dark ? "bg-gray-700" : "bg-gray-50"}>
            <tr>
              {[t.name, t.price, "Stock", t.status, ""].map((h, i) => (
                <th key={i} className="px-4 py-3 text-left font-medium">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr
                key={p._id || p.id}
                className={`border-t ${bd} ${
                  p.stock <= LOW_STOCK_THRESHOLD
                    ? "bg-red-50 dark:bg-red-900/20"
                    : ""
                }`}
              >
                <td className="px-4 py-3 font-medium">
                  {p.emoji || ""}{" "}
                  {lang === "mn" ? p.name.mn : p.name.en}{" "}
                  <span className={`text-xs ${txS}`}>({p.model})</span>
                </td>
                <td className="px-4 py-3">{fmt(p.price)}</td>
                <td className="px-4 py-3">
                  {p.stock <= LOW_STOCK_THRESHOLD && p.stock > 0 ? (
                    <span className="text-red-500 font-bold flex items-center gap-1">
                      <AlertTriangle size={14} />
                      {p.stock}
                    </span>
                  ) : p.stock === 0 ? (
                    <span className="text-red-500">{t.outOfStock}</span>
                  ) : (
                    p.stock
                  )}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      p.cond === "new"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                    }`}
                  >
                    {p.cond === "new" ? t.new : t.used}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button onClick={() => startEdit(p)} className="text-amber-500 hover:text-amber-600">
                      <Pencil size={14} />
                    </button>
                    <button onClick={() => handleDelete(p)} className="text-red-500 hover:text-red-600">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
