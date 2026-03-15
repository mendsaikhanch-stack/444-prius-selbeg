const express = require("express");
const router = express.Router();
const axios = require("axios");

const API_KEY = process.env.OPENWEATHER_API_KEY || "";

// Монголын аймгуудын координат
const AIMAG_COORDS = {
  Arkhangai: { lat: 47.8611, lon: 100.7236, name: "Архангай" },
  Bayankhongor: { lat: 46.1947, lon: 100.7181, name: "Баянхонгор" },
  Bulgan: { lat: 48.8125, lon: 103.5347, name: "Булган" },
  Darkhan: { lat: 49.4686, lon: 106.0508, name: "Дархан" },
  Dornod: { lat: 47.3170, lon: 115.7903, name: "Дорнод" },
  Dundgobi: { lat: 45.7625, lon: 106.2644, name: "Дундговь" },
  Gobi_Altai: { lat: 46.3725, lon: 96.2583, name: "Говь-Алтай" },
  Khentii: { lat: 47.3178, lon: 109.6513, name: "Хэнтий" },
  Khovd: { lat: 48.0056, lon: 91.6428, name: "Ховд" },
  Khuvsgul: { lat: 49.3892, lon: 99.7250, name: "Хөвсгөл" },
  Umnugobi: { lat: 43.5711, lon: 104.4250, name: "Өмнөговь" },
  Orkhon: { lat: 49.0278, lon: 104.1167, name: "Орхон" },
  Selenge: { lat: 49.8900, lon: 106.1847, name: "Сэлэнгэ" },
  Sukhbaatar: { lat: 46.6922, lon: 113.3858, name: "Сүхбаатар" },
  Tuv: { lat: 47.7131, lon: 106.9528, name: "Төв" },
  Uvs: { lat: 49.9847, lon: 92.0669, name: "Увс" },
  Zavkhan: { lat: 48.2608, lon: 96.0703, name: "Завхан" },
  Ulaanbaatar: { lat: 47.9214, lon: 106.9055, name: "Улаанбаатар" },
};

// Демо data (API key байхгүй үед)
const demoData = {
  Arkhangai: { temp: -5, feels_like: -10, wind: 3, humidity: 65, condition: "Clear", description: "Цэлмэг", snow: 0, dzud_risk: "low", forecast: [{ day: 1, temp: -3, condition: "Cloudy" }, { day: 2, temp: -8, condition: "Snow" }, { day: 3, temp: -12, condition: "Storm" }, { day: 4, temp: -7, condition: "Clear" }, { day: 5, temp: -4, condition: "Clear" }, { day: 6, temp: -2, condition: "Cloudy" }, { day: 7, temp: -5, condition: "Clear" }] },
  Khuvsgul: { temp: -15, feels_like: -22, wind: 5, humidity: 75, condition: "Snow", description: "Цас", snow: 20, dzud_risk: "high", forecast: [{ day: 1, temp: -18, condition: "Snow" }, { day: 2, temp: -20, condition: "Storm" }, { day: 3, temp: -16, condition: "Cloudy" }, { day: 4, temp: -12, condition: "Clear" }, { day: 5, temp: -10, condition: "Clear" }, { day: 6, temp: -14, condition: "Snow" }, { day: 7, temp: -11, condition: "Cloudy" }] },
  Umnugobi: { temp: 2, feels_like: -3, wind: 8, humidity: 25, condition: "Windy", description: "Салхитай", snow: 0, dzud_risk: "medium", forecast: [{ day: 1, temp: 0, condition: "Windy" }, { day: 2, temp: -3, condition: "Dust" }, { day: 3, temp: 1, condition: "Clear" }, { day: 4, temp: 4, condition: "Clear" }, { day: 5, temp: 2, condition: "Windy" }, { day: 6, temp: -1, condition: "Cloudy" }, { day: 7, temp: 3, condition: "Clear" }] },
  Tuv: { temp: -3, feels_like: -7, wind: 2, humidity: 55, condition: "Cloudy", description: "Үүлэрхэг", snow: 5, dzud_risk: "low", forecast: [{ day: 1, temp: -2, condition: "Cloudy" }, { day: 2, temp: -5, condition: "Snow" }, { day: 3, temp: -1, condition: "Clear" }, { day: 4, temp: 0, condition: "Clear" }, { day: 5, temp: -3, condition: "Cloudy" }, { day: 6, temp: -4, condition: "Snow" }, { day: 7, temp: -2, condition: "Clear" }] },
};

// Зудын эрсдэлийн тооцоо
function calcDzudRisk(temp, wind, snow) {
  let score = 0;
  if (temp < -30) score += 4;
  else if (temp < -20) score += 3;
  else if (temp < -10) score += 2;
  else if (temp < 0) score += 1;

  if (wind > 15) score += 3;
  else if (wind > 10) score += 2;
  else if (wind > 5) score += 1;

  if (snow > 30) score += 3;
  else if (snow > 15) score += 2;
  else if (snow > 5) score += 1;

  if (score >= 8) return "very_high";
  if (score >= 6) return "high";
  if (score >= 4) return "medium";
  return "low";
}

// Бодит цаг агаарын мэдээ авах (OpenWeatherMap)
async function fetchRealWeather(aimag) {
  const coords = AIMAG_COORDS[aimag];
  if (!coords || !API_KEY) return null;

  try {
    // Current weather
    const current = await axios.get(
      `https://api.openweathermap.org/data/2.5/weather?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=mn`
    );

    // 7-day forecast
    const forecast = await axios.get(
      `https://api.openweathermap.org/data/2.5/forecast?lat=${coords.lat}&lon=${coords.lon}&appid=${API_KEY}&units=metric&lang=mn&cnt=7`
    );

    const c = current.data;
    const snow = c.snow ? c.snow["1h"] || 0 : 0;
    const dzud_risk = calcDzudRisk(c.main.temp, c.wind.speed, snow);

    return {
      aimag,
      name: coords.name,
      temp: Math.round(c.main.temp),
      feels_like: Math.round(c.main.feels_like),
      wind: c.wind.speed,
      humidity: c.main.humidity,
      condition: c.weather[0].main,
      description: c.weather[0].description,
      snow,
      dzud_risk,
      source: "openweathermap",
      forecast: forecast.data.list.map((f, i) => ({
        day: i + 1,
        temp: Math.round(f.main.temp),
        condition: f.weather[0].main,
        description: f.weather[0].description,
      })),
    };
  } catch (err) {
    console.error("Weather API error:", err.message);
    return null;
  }
}

// Аймгийн цаг агаар
router.get("/:aimag", async (req, res) => {
  const aimag = req.params.aimag;

  // API key байвал бодит data авах
  if (API_KEY) {
    const real = await fetchRealWeather(aimag);
    if (real) return res.json(real);
  }

  // Fallback: демо data
  const data = demoData[aimag] || demoData.Tuv;
  res.json({ aimag, source: "demo", ...data });
});

// Бүх аймгийн товч мэдээ
router.get("/", async (req, res) => {
  if (API_KEY) {
    try {
      const results = await Promise.all(
        Object.keys(AIMAG_COORDS).slice(0, 6).map(async (aimag) => {
          const data = await fetchRealWeather(aimag);
          return data || { aimag, ...demoData[aimag] || demoData.Tuv, source: "demo" };
        })
      );
      return res.json(results);
    } catch (err) {
      // fallback
    }
  }

  res.json(
    Object.keys(demoData).map((k) => ({
      aimag: k,
      temp: demoData[k].temp,
      condition: demoData[k].condition,
      dzud_risk: demoData[k].dzud_risk,
      source: "demo",
    }))
  );
});

module.exports = router;
