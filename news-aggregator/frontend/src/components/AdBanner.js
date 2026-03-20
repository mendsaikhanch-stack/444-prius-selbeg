"use client";

const AD_SIZES = {
  leaderboard: { width: "728px", height: "90px", label: "728 x 90" },
  sidebar: { width: "100%", height: "250px", label: "300 x 250" },
  sidebarTall: { width: "100%", height: "600px", label: "300 x 600" },
  inline: { width: "100%", height: "120px", label: "Inline Ad" },
};

export default function AdBanner({ size = "sidebar", className = "" }) {
  const config = AD_SIZES[size] || AD_SIZES.sidebar;

  return (
    <div
      className={`ad-banner border-2 border-dashed border-gray-300 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-gray-400 overflow-hidden ${className}`}
      style={{ minHeight: config.height, maxWidth: config.width }}
    >
      <span className="text-xs uppercase tracking-wide mb-1">Сурталчилгаа</span>
      <span className="text-[10px]">{config.label}</span>
    </div>
  );
}
