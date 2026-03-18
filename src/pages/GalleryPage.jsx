import useApp from "../hooks/useApp";

export default function GalleryPage() {
  const { cd, bd, aL, t, SOCIALS } = useApp();

  const gallery = [
    { img: "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=600&h=400&fit=crop", c: "Орон сууцны засвар" },
    { img: "https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600&h=400&fit=crop", c: "Цахилгааны засвар" },
    { img: "https://images.unsplash.com/photo-1585687433141-4c3d63670488?w=600&h=400&fit=crop", c: "Сантехникийн ажил" },
    { img: "https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=600&h=400&fit=crop", c: "Тохижилт" },
    { img: "https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&h=400&fit=crop", c: "Гэрэлтүүлэг" },
    { img: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=600&h=400&fit=crop", c: "Орон сууц" },
  ];

  return (
    <section className="max-w-7xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-bold mb-6">{t.gallery}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {gallery.map((p, i) => (
          <div
            key={i}
            className={`${cd} rounded-xl border ${bd} overflow-hidden group`}
          >
            <div className={`aspect-video ${aL} overflow-hidden`}>
              <img
                src={p.img}
                alt={p.c}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <p className="p-3 text-sm font-medium">{p.c}</p>
          </div>
        ))}
      </div>
      <div className="text-center mt-6 flex flex-wrap justify-center gap-3">
        {SOCIALS.map((s) => (
          <a
            key={s.key}
            href={s.url}
            target="_blank"
            rel="noopener noreferrer"
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-medium ${s.bg}`}
          >
            <s.Icon size={18} className="text-white" />
            {s.label}
          </a>
        ))}
      </div>
    </section>
  );
}
