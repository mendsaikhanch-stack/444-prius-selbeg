export const fmt = p => `₮${p.toLocaleString()}`;

export const fbTrack = (event, data = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
};

export const trackAddToCart = (product) => {
  fbTrack("AddToCart", {
    content_name: product.name.mn,
    content_ids: [product.id],
    content_type: "product",
    value: product.price,
    currency: "MNT",
  });
};

export const trackPurchase = (total) => {
  fbTrack("Purchase", { value: total, currency: "MNT" });
};

export const getShareUrl = (product, platform, lang, fmt, BIZ) => {
  const text = `${lang === "mn" ? product.name.mn : product.name.en} - ${fmt(product.price)} | ${BIZ.name} | ☎️ ${BIZ.phone}`;
  const siteUrl = BIZ.facebook || "https://sokh-app.mn";
  const fullText = `🏠 ${text}\n\n✅ СӨХ үйлчилгээ\n📍 ${BIZ.address}\n☎️ ${BIZ.phone}\n🌐 ${siteUrl}`;
  if (platform === "facebook") return `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(siteUrl)}&quote=${encodeURIComponent(fullText)}`;
  if (platform === "messenger") return `https://www.facebook.com/dialog/send?link=${encodeURIComponent(siteUrl)}&app_id=0&redirect_uri=${encodeURIComponent(siteUrl)}`;
  if (platform === "instagram") return BIZ.instagram;
  if (platform === "tiktok") return BIZ.tiktok;
  if (platform === "viber") return `viber://forward?text=${encodeURIComponent(fullText)}`;
  if (platform === "whatsapp") return `https://wa.me/?text=${encodeURIComponent(fullText)}`;
  return siteUrl;
};
