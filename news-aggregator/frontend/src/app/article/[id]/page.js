import Header from "../../../components/Header";
import AdBanner from "../../../components/AdBanner";
import Link from "next/link";
import { getArticle } from "../../../lib/api";

export default async function ArticlePage({ params }) {
  const { id } = await params;
  let article = null;

  try {
    article = await getArticle(id);
  } catch {
    // Backend холбогдоогүй
  }

  if (!article || article.error) {
    return (
      <>
        <Header />
        <main className="max-w-3xl mx-auto px-4 py-8 text-center">
          <p className="text-gray-500">Мэдээ олдсонгүй</p>
          <Link href="/" className="text-blue-600 hover:underline mt-4 block">
            Нүүр хуудас руу буцах
          </Link>
        </main>
      </>
    );
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
        {/* Main Article Content */}
        <main className="flex-1 min-w-0 max-w-3xl mx-auto">
          <Link
            href="/"
            className="text-blue-600 hover:underline text-sm mb-4 block"
          >
            ← Буцах
          </Link>

          <article>
            <div className="flex items-center gap-3 mb-4">
              <span className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded">
                {article.source}
              </span>
              {article.published_at && (
                <span className="text-sm text-gray-400">
                  {new Date(article.published_at).toLocaleDateString("mn-MN")}
                </span>
              )}
            </div>

            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {article.title}
            </h1>

            {article.image_url && (
              <img
                src={article.image_url}
                alt={article.title}
                className="w-full rounded-lg mb-6"
              />
            )}

            {/* Inline Ad - зургийн доор */}
            <div className="mb-6">
              <AdBanner size="inline" />
            </div>

            {article.ai_summary && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <h3 className="text-sm font-semibold text-blue-800 mb-1">
                  AI Хураангуй
                </h3>
                <p className="text-gray-700">{article.ai_summary}</p>
              </div>
            )}

            {article.summary && (
              <div
                className="prose max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: article.summary }}
              />
            )}

            {/* Нийтлэл дуусахад inline ad */}
            <div className="mt-6 mb-6">
              <AdBanner size="inline" />
            </div>

            <div className="mt-8 pt-4 border-t">
              <a
                href={article.url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                Эх сурвалж руу очих →
              </a>
            </div>
          </article>
        </main>

        {/* Right Sidebar Ad */}
        <aside className="hidden xl:block w-[200px] flex-shrink-0">
          <div className="sticky top-4 space-y-4">
            <AdBanner size="sidebar" />
            <AdBanner size="sidebarTall" />
          </div>
        </aside>
      </div>
    </>
  );
}
