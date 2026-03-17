"use client";

export default function Header() {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">
          📰 News Aggregator
        </h1>
        <nav className="flex gap-4 text-sm text-gray-600">
          <a href="/" className="hover:text-gray-900">
            Нүүр
          </a>
        </nav>
      </div>
    </header>
  );
}
