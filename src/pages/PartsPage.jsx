import { Building, Heart, Share2, Star, Plus } from "lucide-react";
import useApp from "../hooks/useApp";
import { models, partCats, LOW_STOCK_THRESHOLD } from "../data/products";
import { fmt, trackAddToCart } from "../utils/helpers";

export default function PartsPage({ isHome = false }) {
  const {
    dark, cd, bd, txS, aL, inp, lang, t,
    filtered, searchQ, setSearchQ,
    selModel, setSelModel, selCat, setSelCat,
    sortBy, setSortBy, page, navTo, setPage,
    setShowProductModal, setModalQty, setShowShareModal,
    wishIds, setWishIds, dc, addToast,
  } = useApp();

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      {isHome && <h2 className="text-2xl font-bold mb-6">{t.parts}</h2>}
      <div className="flex flex-wrap gap-2 mb-3">
        <button
          onClick={() => setSelModel(null)}
          className={`px-3 py-1.5 rounded-full text-sm font-medium ${
            !selModel ? "bg-amber-500 text-white" : `border ${bd}`
          }`}
        >
          {t.allModels}
        </button>
        {models.map((m) => (
          <button
            key={m}
            onClick={() => {
              setSelModel(m);
              setPage("parts");
            }}
            className={`px-3 py-1.5 rounded-full text-sm font-medium ${
              selModel === m ? "bg-amber-500 text-white" : `border ${bd}`
            }`}
          >
            {m}
          </button>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-2 mb-6">
        <div className="flex flex-wrap gap-1.5 flex-1">
          {partCats.map((c) => (
            <button
              key={c}
              onClick={() => setSelCat(selCat === c ? null : c)}
              className={`px-2.5 py-1 rounded-lg text-xs font-medium ${
                selCat === c
                  ? `${aL} text-amber-600`
                  : `border ${bd}`
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className={`px-3 py-1.5 rounded-lg border text-sm ${inp}`}
        >
          <option value="default">{t.sortBy}</option>
          <option value="priceLow">{t.priceLow}</option>
          <option value="priceHigh">{t.priceHigh}</option>
          <option value="rating">{t.ratingHigh}</option>
          <option value="name">{t.byName}</option>
        </select>
      </div>
      {filtered.length === 0 ? (
        <div className={`text-center py-16 ${txS}`}>
          <Building size={48} className="mx-auto mb-3 opacity-30" />
          <p className="mb-2">{t.noProducts}</p>
          <button
            onClick={() => {
              setSelModel(null);
              setSelCat(null);
              setSearchQ("");
            }}
            className="text-amber-500"
          >
            {t.clearFilters}
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-5">
          {(isHome ? filtered.slice(0, 8) : filtered).map((p) => (
            <div
              key={(p._id || p.id)}
              className={`${cd} rounded-xl border ${bd} overflow-hidden group hover:shadow-lg transition-all`}
            >
              <div
                className={`relative aspect-square ${aL} overflow-hidden cursor-pointer`}
                onClick={() => {
                  setShowProductModal(p);
                  setModalQty(1);
                }}
              >
                {p.img.startsWith("http") ? (
                  <img
                    src={p.img}
                    alt={lang === "mn" ? p.name.mn : p.name.en}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "flex";
                    }}
                  />
                ) : null}
                <div
                  className={`w-full h-full items-center justify-center text-5xl ${
                    p.img.startsWith("http") ? "hidden" : "flex"
                  }`}
                >
                  {p.emoji || p.img}
                </div>
                {p.stock === 0 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                    <span className="bg-red-500 text-white text-xs px-2 py-0.5 rounded">
                      {t.outOfStock}
                    </span>
                  </div>
                )}
                {p.stock > 0 && p.stock <= LOW_STOCK_THRESHOLD && (
                  <div className="absolute bottom-2 left-2">
                    <span className="bg-orange-500 text-white text-xs px-2 py-0.5 rounded animate-pulse">
                      {t.lowStock} {p.stock}
                      {t.onlyLeft}
                    </span>
                  </div>
                )}
                <div className="absolute top-2 right-2 flex flex-col gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setWishIds((prev) =>
                        prev.includes((p._id || p.id))
                          ? prev.filter((x) => x !== (p._id || p.id))
                          : [...prev, (p._id || p.id)]
                      );
                    }}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white shadow"
                  >
                    <Heart
                      size={14}
                      className={
                        wishIds.includes((p._id || p.id))
                          ? "text-red-500 fill-red-500"
                          : "text-gray-400"
                      }
                    />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowShareModal(p);
                    }}
                    className="p-1.5 rounded-full bg-white/80 hover:bg-white shadow"
                  >
                    <Share2 size={14} className="text-gray-500" />
                  </button>
                </div>
                <span
                  className={`absolute top-2 left-2 text-xs px-2 py-0.5 rounded-full ${
                    p.cond === "new"
                      ? "bg-green-500 text-white"
                      : "bg-blue-500 text-white"
                  }`}
                >
                  {p.cond === "new" ? t.new : t.used}
                </span>
              </div>
              <div className="p-3">
                <p className={`text-xs ${txS} mb-0.5`}>{p.model}</p>
                <h3 className="font-medium text-sm mb-1 truncate">
                  {lang === "mn" ? p.name.mn : p.name.en}
                </h3>
                <div className="flex items-center gap-1 mb-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={11}
                      className={
                        i < Math.floor(p.rating)
                          ? "text-yellow-400 fill-yellow-400"
                          : txS
                      }
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-amber-500">
                    {fmt(p.price)}
                  </span>
                  <button
                    disabled={p.stock === 0}
                    onClick={() => {
                      dc({ type: "ADD", p, q: 1 });
                      trackAddToCart(p);
                      addToast(t.addedToCart);
                    }}
                    className={`p-2 rounded-lg text-white ${
                      p.stock > 0
                        ? "bg-amber-500 hover:bg-amber-600"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
      {isHome && filtered.length > 8 && (
        <div className="text-center mt-6">
          <button
            onClick={() => navTo("parts")}
            className="px-6 py-2 rounded-xl border border-amber-500 text-amber-500 font-medium"
          >
            {t.shopNow} →
          </button>
        </div>
      )}
    </section>
  );
}
