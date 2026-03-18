export const fmt = p => `₮${p.toLocaleString()}`;

export const fbTrack = (event, data = {}) => {
  if (typeof window !== "undefined" && window.fbq) {
    window.fbq("track", event, data);
  }
};
