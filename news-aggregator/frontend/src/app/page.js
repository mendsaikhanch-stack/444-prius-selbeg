import Header from "../components/Header";
import SearchBar from "../components/SearchBar";
import CategoryFilter from "../components/CategoryFilter";
import ArticleCard from "../components/ArticleCard";
import AdBanner from "../components/AdBanner";
import { getArticles } from "../lib/api";

export default async function HomePage({ searchParams }) {
  const params = await searchParams;
  const search = params?.search || "";
  const category = params?.category || "";
  let articles = [];

  try {
    articles = await getArticles({ search, category });
  } catch {
    // Backend холбогдоогүй бол хоосон жагсаалт
  }

  return (
    <>
      <Header />

      {/* Top Leaderboard Ad */}
      <div className="max-w-7xl mx-auto px-4 pt-4">
        <div className="flex justify-center">
          <AdBanner size="leaderboard" />
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8 flex gap-6">
        {/* Left Sidebar Ad */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <AdBanner size="sidebar" />
            <AdBanner size="sidebarTall" />
          </div>
        </aside>

        {/* Main Content */}
        <main className="flex-1 min-w-0">
          <div className="flex justify-center mb-8">
            <SearchBar />
          </div>
          <div className="flex justify-center mb-6">
            <CategoryFilter />
          </div>

          {articles.length === 0 ? (
            <div className="text-center py-20 text-gray-500">
              <p className="text-xl mb-2">Мэдээ олдсонгүй</p>
              <p className="text-sm">
                Backend серверийг ажиллуулж, <code>POST /api/articles/fetch</code>{" "}
                дуудан мэдээ татна уу.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {articles.map((article, index) => (
                <>
                  <ArticleCard key={article.id} article={article} />
                  {/* 6 мэдээ бүрийн дараа inline сурталчилгаа */}
                  {(index + 1) % 6 === 0 && index < articles.length - 1 && (
                    <div key={`ad-${index}`} className="col-span-1 md:col-span-2 lg:col-span-3">
                      <AdBanner size="inline" />
                    </div>
                  )}
                </>
              ))}
            </div>
          )}
        </main>

        {/* Right Sidebar Ad */}
        <aside className="hidden lg:block w-[200px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <AdBanner size="sidebar" />
            <AdBanner size="sidebar" />
          </div>
        </aside>
      </div>
    </>
  );
}
