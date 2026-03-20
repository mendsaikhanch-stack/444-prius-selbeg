"use client";

import { useRouter, useSearchParams } from "next/navigation";

const CATEGORIES = ["Дэлхий", "Технологи", "Спорт", "Бизнес"];

export default function CategoryFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const active = searchParams.get("category") || "";

  function handleClick(category) {
    const params = new URLSearchParams(searchParams.toString());
    if (category === active) {
      params.delete("category");
    } else {
      params.set("category", category);
    }
    // Хайлт хадгалагдана
    router.push(`/?${params.toString()}`);
  }

  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map((cat) => (
        <button
          key={cat}
          onClick={() => handleClick(cat)}
          className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
            active === cat
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}
