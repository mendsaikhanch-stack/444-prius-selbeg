import { Building, Wrench, Users, Phone } from "lucide-react";
import useApp from "../../hooks/useApp";

export default function OverviewTab() {
  const { cd, bd, txS, lang, BIZ } = useApp();

  return (
    <div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {[
          [lang === "mn" ? "Нийт байр" : "Buildings", "5", Building, "text-blue-500"],
          [lang === "mn" ? "Үйлчилгээ" : "Services", "8", Wrench, "text-green-500"],
          [lang === "mn" ? "Оршин суугч" : "Residents", "120+", Users, "text-amber-500"],
          [lang === "mn" ? "Утас" : "Phone", BIZ.phone, Phone, "text-purple-500"],
        ].map(([l, v, I, c], i) => (
          <div key={i} className={`${cd} rounded-xl p-5 border ${bd}`}>
            <div className="flex justify-between mb-2">
              <span className={`text-sm ${txS}`}>{l}</span>
              <I size={18} className={c} />
            </div>
            <div className="text-2xl font-bold">{v}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
