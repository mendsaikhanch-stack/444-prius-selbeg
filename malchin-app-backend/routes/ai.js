const express = require("express");
const router = express.Router();

const aiKnowledge = {
  turai:
    "Мал тураах шалтгаанууд: 1) Тэжээл хангалтгүй 2) Хорхой шимэгч 3) Шимэгч өвчин 4) Шүдний асуудал 5) Стресс. Зөвлөмж: Малын эмчээр үзүүлж, тэжээлийн нэмэлт өгнө.",
  tol:
    "Төллөлтийн бэлтгэл: 1) Хээлтэгч малд тэжээлийн нэмэлт өгөх 2) Дулаан хашаа бэлдэх 3) Малын эмчтэй холбоо барих.",
  noosuur:
    "Ноолуурын бэлтгэл: 1) 4-р сарын эхээр самнаж эхлэх 2) Ямааг угааж цэвэрлэх 3) Хуурай газар хадгалах. Үнэ: 85,000-95,000₮/кг.",
  uvul:
    "Өвөлжилтийн бэлтгэл: 1) Өвс хадах 2) Хашаа засах 3) Тэжээлийн нөөц бүрдүүлэх. 1 хонинд 2кг өвс/өдөр, 1 үхэрт 8кг өвс/өдөр.",
  uvchun:
    "Түгээмэл өвчнүүд: 1) Шүлхий - вакцин 2) Боом - вакцин 3) Галзуу 4) Бруцеллёз 5) Малын хорхой - улирал бүр эм өгөх.",
  zud:
    "Зудын бэлтгэл: 1) Өвс хадах 2) Нөөцийн тэжээл 3) Отрын бэлчээр 4) Хашаа бэхлэх 5) Даатгалд хамрагдах.",
};

// AI-с асуулт асуух
router.post("/ask", (req, res) => {
  const q = (req.body.question || "").toLowerCase();
  let answer = "Асуултаа тодорхой бичнэ үү.";

  if (q.includes("тура") || q.includes("turaa") || q.includes("turah")) {
    answer = aiKnowledge.turai;
  } else if (q.includes("төл") || q.includes("tol") || q.includes("birth")) {
    answer = aiKnowledge.tol;
  } else if (q.includes("ноолуур") || q.includes("nooluur") || q.includes("cashmere")) {
    answer = aiKnowledge.noosuur;
  } else if (q.includes("өвөл") || q.includes("uvul") || q.includes("winter")) {
    answer = aiKnowledge.uvul;
  } else if (q.includes("өвч") || q.includes("uvch") || q.includes("disease") || q.includes("sick")) {
    answer = aiKnowledge.uvchun;
  } else if (q.includes("зуд") || q.includes("zud") || q.includes("dzud")) {
    answer = aiKnowledge.zud;
  }

  res.json({ question: req.body.question, answer, timestamp: new Date() });
});

// Өдрийн зөвлөмж
router.get("/tips", (req, res) => {
  const tips = [
    "Энэ 7 хоногт хүйтрэлт ихсэнэ. Малаа хашааны ойролцоо байлгаж, тэжээлийн нөөцөө шалгаарай.",
    "Хаврын төллөлтийн улирал ойртож байна. Хээлтэгч малдаа тэжээлийн нэмэлт өгч эхлээрэй.",
    "Ноолуурын ханш өмнөх жилээс 10% өссөн. 4-р сарын эхээр самнаж бэлдээрэй.",
    "Малын вакцины хуваарийг шалгаарай. Хаврын вакцинжуулалт 4-р сард эхэлнэ.",
    "Бэлчээрийн ургамал сэргэж эхлэх хүртэл нөөцийн тэжээл ашиглаарай.",
  ];
  const tip = tips[Math.floor(Math.random() * tips.length)];
  res.json({ tip, date: new Date() });
});

module.exports = router;
